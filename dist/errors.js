"use strict";
/**
 * This module provides Twirp errors according to the Twirp spec.
 */
Object.defineProperty(exports, "__esModule", { value: true });
class TwirpError extends Error {
    constructor() {
        super(...arguments);
        this.statusCode = 500;
        this.message = this.message;
        this.name = 'internal';
        this.isTwirpError = true;
    }
}
exports.TwirpError = TwirpError;
var TwirpErrorCode;
(function (TwirpErrorCode) {
    // Canceled indicates the operation was cancelled (typically by the caller).
    TwirpErrorCode["Canceled"] = "canceled";
    // Unknown error. For example when handling errors raised by APIs that do not
    // return enough error information.
    TwirpErrorCode["Unknown"] = "unknown";
    // InvalidArgument indicates client specified an invalid argument. It
    // indicates arguments that are problematic regardless of the state of the
    // system (i.e. a malformed file name, required argument, number out of range,
    // etc.).
    TwirpErrorCode["InvalidArgument"] = "invalid_argument";
    // DeadlineExceeded means operation expired before completion. For operations
    // that change the state of the system, this error may be returned even if the
    // operation has completed successfully (timeout).
    TwirpErrorCode["DeadlineExceeded"] = "deadline_exceeded";
    // NotFound means some requested entity was not found.
    TwirpErrorCode["NotFound"] = "not_found";
    // BadRoute means that the requested URL path wasn't routable to a Twirp
    // service and method. This is returned by the generated server, and usually
    // shouldn't be returned by applications. Instead, applications should use
    // NotFound or Unimplemented.
    TwirpErrorCode["BadRoute"] = "bad_route";
    // AlreadyExists means an attempt to create an entity failed because one
    // already exists.
    TwirpErrorCode["AlreadyExists"] = "already_exists";
    // PermissionDenied indicates the caller does not have permission to execute
    // the specified operation. It must not be used if the caller cannot be
    // identified (Unauthenticated).
    TwirpErrorCode["PermissionDenied"] = "permission_denied";
    // Unauthenticated indicates the request does not have valid authentication
    // credentials for the operation.
    TwirpErrorCode["Unauthenticated"] = "unauthenticated";
    // ResourceExhausted indicates some resource has been exhausted, perhaps a
    // per-user quota, or perhaps the entire file system is out of space.
    TwirpErrorCode["ResourceExhausted"] = "resource_exhausted";
    // FailedPrecondition indicates operation was rejected because the system is
    // not in a state required for the operation's execution. For example, doing
    // an rmdir operation on a directory that is non-empty, or on a non-directory
    // object, or when having conflicting read-modify-write on the same resource.
    TwirpErrorCode["FailedPrecondition"] = "failed_precondition";
    // Aborted indicates the operation was aborted, typically due to a concurrency
    // issue like sequencer check failures, transaction aborts, etc.
    TwirpErrorCode["Aborted"] = "aborted";
    // OutOfRange means operation was attempted past the valid range. For example,
    // seeking or reading past end of a paginated collection.
    //
    // Unlike InvalidArgument, this error indicates a problem that may be fixed if
    // the system state changes (i.e. adding more items to the collection).
    //
    // There is a fair bit of overlap between FailedPrecondition and OutOfRange.
    // We recommend using OutOfRange (the more specific error) when it applies so
    // that callers who are iterating through a space can easily look for an
    // OutOfRange error to detect when they are done.
    TwirpErrorCode["OutOfRange"] = "out_of_range";
    // Unimplemented indicates operation is not implemented or not
    // supported/enabled in this service.
    TwirpErrorCode["Unimplemented"] = "unimplemented";
    // Internal errors. When some invariants expected by the underlying system
    // have been broken. In other words, something bad happened in the library or
    // backend service. Do not confuse with HTTP Internal Server Error; an
    // Internal error could also happen on the client code, i.e. when parsing a
    // server response.
    TwirpErrorCode["Internal"] = "internal";
    // Unavailable indicates the service is currently unavailable. This is a most
    // likely a transient condition and may be corrected by retrying with a
    // backoff.
    TwirpErrorCode["Unavailable"] = "unavailable";
    // DataLoss indicates unrecoverable data loss or corruption.
    TwirpErrorCode["DataLoss"] = "data_loss";
})(TwirpErrorCode || (TwirpErrorCode = {}));
// NotFoundError for the common NotFound error.
class NotFoundError extends TwirpError {
    constructor() {
        super(...arguments);
        this.statusCode = 404;
        this.name = TwirpErrorCode.NotFound;
    }
}
exports.NotFoundError = NotFoundError;
// InvalidArgumentError constructor for the common InvalidArgument error. Can be
// used when an argument has invalid format, is a number out of range, is a bad
// option, etc).
class InvalidArgumentError extends TwirpError {
    constructor() {
        super(...arguments);
        this.statusCode = 400;
        this.name = TwirpErrorCode.InvalidArgument;
    }
}
exports.InvalidArgumentError = InvalidArgumentError;
// RequiredArgumentError is a more specific constructor for InvalidArgument
// error. Should be used when the argument is required (expected to have a
// non-zero value).
class RequiredArgumentError extends TwirpError {
    constructor(argumentName) {
        super(`${argumentName} is required`);
        this.statusCode = 400;
        this.name = TwirpErrorCode.InvalidArgument;
    }
}
exports.RequiredArgumentError = RequiredArgumentError;
// InternalError constructor for the common Internal error. Should be used to
// specify that something bad or unexpected happened.
class InternalServerError extends TwirpError {
    constructor() {
        super(...arguments);
        this.statusCode = 500;
        this.name = TwirpErrorCode.Internal;
    }
}
exports.InternalServerError = InternalServerError;
// badRouteError is used when the twirp server cannot route a request`)
class BadRouteError extends TwirpError {
    constructor() {
        super(...arguments);
        this.statusCode = 404;
        this.name = TwirpErrorCode.BadRoute;
    }
}
exports.BadRouteError = BadRouteError;
// twirpErrorFromIntermediary maps HTTP errors from non-twirp sources to twirp errors.
// The mapping is similar to gRPC: https://github.com/grpc/grpc/blob/master/doc/http-grpc-status-mapping.md.
function twirpErrorFromIntermediary(status) {
    let code = TwirpErrorCode.Unknown;
    if (status >= 300 && status <= 399) {
        code = TwirpErrorCode.Internal;
    }
    else {
        switch (status) {
            case 400: // Bad Request
                code = TwirpErrorCode.Internal;
                break;
            case 401: // Unauthorized
                code = TwirpErrorCode.Unauthenticated;
                break;
            case 403: // Forbidden
                code = TwirpErrorCode.PermissionDenied;
                break;
            case 404: // Not Found
                code = TwirpErrorCode.BadRoute;
                break;
            case 429: // Too Many Requests
            case 502: // Bad Gateway
            case 503: // Service Unavailable
            case 504: // Gateway Timeout
                code = TwirpErrorCode.Unavailable;
                break;
            default:
                // All other codes
                code = TwirpErrorCode.Unknown;
        }
    }
    return code;
}
exports.twirpErrorFromIntermediary = twirpErrorFromIntermediary;
