import typing

from time import strftime
from time import time

from enum import Enum


_esc = lambda c: "\033["+c+"m"

class Log(object):
    def __init__(self): self.level = LogLevel.INFO

    def _print(
        self,
        text      : str,
        levelName : str,
        colour    : str,
        end       : str
    ):
        finalString: str = ""
        finalString += _esc(f"3{colour};1") + f"{levelName}"        # log level name
        finalString += _esc("0;37;1")       +  "::"                 # separator
        finalString += _esc("0;1")          + strftime("%H:%m:%S")  # timestamp
        finalString += _esc("0;37;1")       +  "::"                 # separator
        finalString += _esc("0")            + text                  # log text
        print(finalString, end=end)

    def dbug(self, text: str, end="\n"): 
        if self.level.value <= LogLevel.DBUG.value: self._print(text, "DBUG", 4, end)
    def info(self, text: str, end="\n"):
        if self.level.value <= LogLevel.INFO.value: self._print(text, "INFO", 2, end)
    def warn(self, text: str, end="\n"):
        if self.level.value <= LogLevel.WARN.value: self._print(text, "WARN", 3, end)
    def fail(self, text: str, end="\n"):
        if self.level.value <= LogLevel.FAIL.value: self._print(text, "FAIL", 1, end)

class LogLevel(Enum):
    DBUG = 0
    INFO = 1
    WARN = 2
    FAIL = 3


log = Log()
log.level = LogLevel.INFO
