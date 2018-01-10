# TODO: it is ok to put the connect string in the config for private topology apps, but we should
# add some additional connection mechanisms, especially from the keyserver

import datetime
import logging
import math
import threading

from sqlalchemy import create_engine, event
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm.scoping import scoped_session

from taro.config import CONFIG
from taro.util import iterutil
from taro.util import metautil

SESSION_MAKER_LOCK = threading.RLock()

class BaseModel(object):

    __abstract__ = True

    classRegistry = {}
    contextManagerStore = threading.local()
    sessionScopers = {}
    engineArgs = None

    @classmethod
    def clearSession(cls):
        session = cls.getSession()
        session.remove()
        session._rollbackLater = False

    @classmethod
    def commitSession(cls, clear=True, checkRollbackLater=True):
        session = cls.getSession()
        if checkRollbackLater:
            shouldRollback = getattr(session, '_rollbackLater', False)
            if shouldRollback:
                return cls.rollbackSession(clear=clear)

        try:
            session.commit()
        finally:
            if clear:
                cls.clearSession()

    @classmethod
    def execute(cls, sql, *args, **kwargs):
        session = cls.getSession()
        return session.execute(sql, *args, **kwargs)

    @classmethod
    def fetchAll(cls, sql, *args, **kwargs):
        result = cls.execute(sql, *args, **kwargs)
        keys = result.keys()
        return [
            dict(zip(keys, row))
            for row
            in result.fetchall()
        ]

    @classmethod
    def fetchOne(cls, sql, *args, **kwargs):
        result = cls.execute(sql, *args, **kwargs)
        keys = result.keys()
        row = result.fetchone()
        if row:
            return dict(zip(keys, row))

    @classmethod
    def flushSession(cls):
        session = cls.getSession()
        session.flush()

    @classmethod
    def forId(cls, id):
        if id:
            return cls.query().get(id)

    @classmethod
    def forIds(cls, ids):
        order = dict(
            (id, i)
            for i, id
            in enumerate(ids)
        )
        results = cls.query()\
            .filter(cls.id.in_(ids))\
            .all()
        return sorted(
            results,
            key=lambda x: order.get(x.id),
        )

    @classmethod
    def getSession(cls, serializable=None):
        if serializable is None:
            manager = getattr(cls.contextManagerStore, 'mgr', None)
            if manager:
                serializable = manager.serializable
            else:
                serializable = False

        if serializable not in cls.sessionScopers:
            sessionMaker = cls._getSessionMaker(serializable)
            cls.sessionScopers[serializable] = scoped_session(sessionMaker)

        # TODO: should we warn if isolation level is changed?
        return cls.sessionScopers[serializable]

    @classmethod
    def rollbackSession(cls, clear=True):
        session = cls.getSession()
        try:
            session.rollback()
        finally:
            if clear:
                cls.clearSession()

    @classmethod
    def rollbackSessionLater(cls):
        session = cls.getSession()
        session._rollbackLater = True

    @classmethod
    def query(cls):
        session = cls.getSession()
        return session.query(cls)

    @classmethod
    def sessionContext(cls, autoRollback=False, serializable=False):

        class ContextManager(object):

            def __init__(self, autoRollback=False, serializable=False):
                self.autoRollback = autoRollback
                self.serializable = serializable

            def __enter__(self):
                cls.contextManagerStore.mgr = self
                cls.clearSession()
                return cls.getSession(self.serializable)

            def __exit__(self, exc, val, traceback):
                try:
                    if (exc is None) and (not self.autoRollback):
                        cls.commitSession()
                    else:
                        cls.rollbackSession()
                finally:
                    cls.contextManagerStore.mgr = None

        return ContextManager(
            autoRollback=autoRollback,
            serializable=serializable,
        )

    @classmethod
    def setEngine(cls, sqlConnect, kwargs):
        with SESSION_MAKER_LOCK:
            cls.engineArgs = {
                'sqlConnect': sqlConnect,
                'kwargs': kwargs,
            }

    @classmethod
    def _getDefaultConnectArgs(cls):
        sqlConnect = iterutil.safe(CONFIG, 'sqlalchemy', 'connect')
        if sqlConnect.startswith('postgresql'):
            kwargs = {
                'pool_size': 0,
                'max_overflow': -1,
            }
        else:
            kwargs = {}

        return sqlConnect, kwargs

    @classmethod
    def _getSessionMaker(cls, serializable=False):
        with SESSION_MAKER_LOCK:
            if not hasattr(cls, '_sessionMakers'):
                cls._sessionMakers = {}

            if serializable not in cls._sessionMakers:
                if cls.engineArgs:
                    sqlConnect = cls.engineArgs['sqlConnect']
                    kwargs = cls.engineArgs['kwargs']
                else:
                    sqlConnect, kwargs = cls._getDefaultConnectArgs()
                    cls.setEngine(sqlConnect, kwargs)

                if serializable:
                    isolation = 'SERIALIZABLE'
                else:
                    isolation = iterutil.safe(CONFIG, 'sqlalchemy', 'isolation')\
                        or 'READ_COMMITTED'

                engine = create_engine(
                    sqlConnect,
                    echo=iterutil.safe(
                        CONFIG,
                        'sqlalchemy',
                        'echo'
                    ),
                    isolation_level=isolation,
                    **kwargs
                )
                maker = sessionmaker(bind=engine)
                cls._sessionMakers[serializable] = maker

            return cls._sessionMakers[serializable]

    def delete(self):
        self.getSession().delete(self)

    def detach(self):
        session = self.getSession()
        session.expunge(self)

    def refreshNontransactionally(self):
        sessionMaker = self._getSessionMaker()
        newSession = sessionMaker()
        try:
            query = newSession.query(self.__class__)
            return query.get(self.id)
        finally:
            newSession.close()

    def put(self, flush=False):
        self.getSession().add(self)
        if flush:
            self.flushSession()

    def refresh(self):
        session = self.getSession()
        session.refresh(self)

def forIdOrNew(id, model, put=False):
    # TODO: this assumes id is an int...
    if id == 'new':
        item = model()
        if put:
            item.put(True)
        return item
    else:
        return model.forId(int(id))

def paginate(query, page=None, perPage=20, limit=500):
    if page is None:
        page = 1

    if limit:
        limitedQuery = query.limit(limit)
    else:
        limitedQuery = query
    total = limitedQuery.count()

    pages = int(math.ceil(total / float(perPage)))
    start = (page-1) * perPage
    results = query.offset(start).limit(perPage).all()
    return {
        'total': total,
        'page': page,
        'pages': pages,
        'perPage': perPage,
        'results': results,
    }

BaseModel = declarative_base(cls=BaseModel)

EMPTY_PAGE = {
    'total': 0,
    'page': 1,
    'pages': 1,
    'results': [],
}

def augmentApp(app):
    @app.before_request
    def resetSession():
        BaseModel.clearSession()

    @app.after_request
    def commitSession(response):
        if hasattr(response, 'status_code'):
            if response.status_code >= 400:
                logging.error("Bad error code, rolling back TX...")
                BaseModel.rollbackSession()
                return response

        BaseModel.commitSession()
        return response
