class NotFoundError(Exception):
    pass


class ValidationError(Exception):
    pass


class InsufficientFundsError(Exception):
    pass


class DuplicateEmailError(Exception):
    pass


class CustomerHasAccountsError(Exception):
    pass


class AccountHasBalanceError(Exception):
    pass


class DuplicateUsernameError(Exception):
    pass


class InvalidCredentialsError(Exception):
    pass
