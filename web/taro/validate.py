import base64
import datetime
import dateutil.parser
import json
import logging
import pickle
# import phonenumbers
import re
import six
import yaml

class Validator(object):
    """
        Validate and/or manipulate a single value.
    """

    @classmethod
    def applyValidators(cls, value, validators):
        for validator in validators:
            value = validator.validate(value)
        return value

    def transform(self, value):
        """
            Default behavior:
                validate `value` using `self.verify`,
                return `value` unmodified.
            Override `transform` to change the return value.
            This method will never receive None values.
        """
        self.verify(value)
        return value

    def validate(self, value):
        """
            Validate `value`, possibly modifying the result via `transform`
            Always accepts None values -- if you want to handle None values, you must override this method.
        """
        if value is None: return None
        else: return self.transform(value)

    def verify(self, value):
        """
            Subclasses can implement this method to determine whether or not input is valid. They should raise
            a ValueError in the event the value is bad.
            This method will not receive nulls.
        """
        pass

class B64Decode(Validator):

    def transform(self, value):
        return base64.b64decode(value)

class BoolValidator(Validator):

    def verify(self, value):
        if value not in (True, False):
            raise ValueError("Not a boolean.")

class DefaultValue(Validator):

    def __init__(self, default):
        self.default = default

    def validate(self, value):
        if value is None: return self.default
        else: return value

class Deepochify(Validator):

    def transform(self, value):
        if value == "":
            return None

        try:
            value = int(value)
        except:
            raise ValueError('must be an integer.')

        return timeutil.deepochify(value)

class DictValidate(Validator):

    def __init__(self, **fields):
        self.fields = fields

    def transform(self, value):
        if not isinstance(value, dict):
            raise ValueError("Not a dict!")

        out = dict(value)
        for key, validators in self.fields.items():
            try:
                out[key] = Validator.applyValidators(
                    out.get(key),
                    validators,
                )
            except Exception as e:
                raise ValueError("%s: %s" % (key, str(e)))
        return out

class Email(Validator):
    """Verify that the value is an email."""

    def transform(self, value):
        value = value.lower().replace(' ', '')
        if not re.match(r'^.+@.+\..+$', value):
            raise ValueError("Must be an email")
        return value

class FlexibleDictValidate(Validator):

    def __init__(self, *validators):
        self.validators = validators

    def transform(self, value):
        if not isinstance(value, dict):
            raise ValueError("Not a dict!")

        out = dict(value)
        for key, value in value.items():
            try:
                out[key] = Validator.applyValidators(
                    value,
                    self.validators,
                )
            except Exception as e:
                raise ValueError("%s: %s" % (key, str(e)))
        return out

class FloatValidator(Validator):

    def transform(self, value):
        if isinstance(value, float):
            return value
        elif isinstance(value, int):
            return float(value)
        else:
            raise ValueError("Not a float.")

class InListValidator(Validator):

    def __init__(self, *values):
        self.values = values

    def verify(self, value):
        if value not in self.values:
            raise ValueError('not one of %s' % ",".join(self.values))

class IntValidator(Validator):

    def verify(self, value):
        if not isinstance(value, int):
            raise ValueError("Not an int.")

class ParseBool(Validator):
    def __init__(self, nullable=False):
        self.nullable = nullable

    def validate(self, value):
        if value and isinstance(value, six.string_types):
            value = value.upper()

        if self.nullable:
            if value in ("TRUE", "YES", True):
                return True
            elif value in ("", "NONE", None):
                return None
            else:
                return False
        else:
            return value not in ("FALSE", "NO", "0", False, None)

class ParseDatetimeSmart(Validator):

    def transform(self, value):
        return dateutil.parser.parse(value)

class ParseFloat(Validator):
    """
        Parse the value, using parser.parseFloat
    """

    def __init__(self, replaceOther=False):
        self.replaceOther = replaceOther

    def transform(self, value):
        if self.replaceOther:
            value = re.sub(r'[^0-9\.]', '', value)
        if value == "": return None
        try: return float(value)
        except: raise ValueError('must be a float.')

class ParseInt(Validator):
    """
        Parse the value, using parser.parseInt
    """

    def __init__(self, clean=False):
        self.clean = clean

    def transform(self, value):
        if self.clean:
            value = re.sub(r'[^0-9\.]', '', value)

        if value in ['', 'None']:
            return None

        try:
            floatValue = float(value)
        except ValueError:
            raise ValueError("must be a number")

        intValue = int(floatValue)

        if intValue != floatValue:
            raise ValueError("must be an integer")

        return intValue

class ParseJson(Validator):

    def transform(self, value):
        if value == "": return None
        try: return json.loads(value)
        except: raise ValueError('must be a json')

class ParseTime(Validator):

    def __init__(self, format="%H:%M"):
        self.format = format
        # TODO: convert from est??

    def transform(self, value):
        isTime = isinstance(value, datetime.time)
        # Becasue datetime.time(0, 0, 0) == False in Python 2 https://bugs.python.org/issue13936
        if not value and not isTime:
            return None
        elif isTime:
            return value
        else:
            try:
                date = datetime.datetime.strptime(value, self.format)
                return date.time()
            except:
                raise ValueError("Must be date in %s" % self.format)

class ParseYaml(Validator):

    def transform(self, value):
        if value == "": return None
        try: return yaml.safe_load(value)
        except: raise ValueError('must be a yaml')

class PhoneSmart(Validator):

    def __init__(self, country=None, validateNumber=True):
        if country is None:
            country = 'US'
        self.country = country
        self.validateNumber = validateNumber

    def transform(self, value):
        phone = phonenumbers.parse(value, self.country)

        if self.validateNumber:
            if not phonenumbers.is_valid_number(phone):
                raise ValueError("Invalid phone number!")

        return phonenumbers.format_number(
            phone,
            phonenumbers.PhoneNumberFormat.E164,
        )

class Required(Validator):
    """
        Fails if input is None.
    """

    def validate(self, value):
        if value in [None, '']:
            raise ValueError("required")
        else:
            return value

class ListValidate(Validator):

    def __init__(self, *validators):
        self.validators = validators

    def transform(self, value):
        if not isinstance(value, list):
            raise ValueError("Not a list!")
        lst = []
        for i, item in enumerate(value):
            try:
                lst.append(Validator.applyValidators(
                    item,
                    self.validators,
                ))
            except Exception as e:
                raise ValueError("[%s] %s" % (i, str(e)))
        return lst

class ListSimple(Validator):

    def transform(self, value):
        lst = []
        if value:
            for item in value.split(","):
                if item:
                    lst.append(item)
        return lst

class KvSimple(Validator):

    def __init__(self, *validators):
        self.validators = validators

    def transform(self, value):
        mapping = {}
        if value:
            for kv in value.split(","):
                if ':' in kv:
                    key, value = kv.split(':', 1)
                    if not re.match(r'^[A-Za-z0-9\-_\.]+$', key):
                        raise ValueError("Invalid key: %s" % key)
                    mapping[key] = Validator.applyValidators(
                        value,
                        self.validators,
                    )
                else:
                    raise ValueError("No : in kv item '%s'" % kv)
        return mapping

class StringValidator(Validator):
    """
        Fails if input is not a string.
        Can optionall preform certain transformations
    """

    def __init__(self, emptyToNone=True, strip=True, force=False):
        self.emptyToNone = emptyToNone
        self.strip = strip
        self.force = force

    def transform(self, value):
        if not isinstance(value, six.string_types):
            if self.force: value = str(value)
            else: raise ValueError("must be a string")

        if self.strip:
            value = value.strip()

        if self.emptyToNone and value == '':
            value = None

        return value

class Unpickle(Validator):

    def __init__(self, b64=False):
        self.b64 = b64

    def transform(self, value):
        if value == "":
            return None
        if self.b64:
            value = base64.b64decode(value)
        return pickle.loads(value)

def apply(value, *validators):
    return Validator.applyValidators(value, validators)

def applySafe(value, *validators):
    try:
        return Validator.applyValidators(value, validators)
    except Exception as e:
        return None

def get(dct, key, *validators):
    value = dct.get(key)
    try:
        return Validator.applyValidators(value, validators)
    except Exception as e:
        raise ValueError("%s: %s" % (key, str(e)))

def getSafe(dct, key, *validators):
    try:
        return get(dct, key, *validators)
    except Exception as e:
        return None

def getError(value, *validators):
    try:
        Validator.applyValidators(value, validators)
    except Exception as e:
        return str(e)
