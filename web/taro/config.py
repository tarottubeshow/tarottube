import yaml

with open('/opt/repo/config.yaml') as configFile:
    CONFIG = yaml.safe_load(configFile.read())
