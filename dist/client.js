"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const protobufjs_1 = require("protobufjs");
const http_1 = __importDefault(require("http"));
function createProtobufRPCImpl(params) {
    const rpcImpl = (method, requestData, callback) => {
        const chunks = [];
        const req = http_1.default
            .request({
            hostname: params.host,
            port: params.port,
            path: params.path + method.name,
            method: 'POST',
            headers: {
                'Content-Type': 'application/protobuf',
                'Content-Length': Buffer.byteLength(requestData),
            },
        }, res => {
            res.on('data', chunk => chunks.push(chunk));
            res.on('end', () => {
                const data = Buffer.concat(chunks);
                if (res.statusCode != 200) {
                    callback(getTwirpError(data), null);
                }
                else {
                    callback(null, data);
                }
            });
            res.on('error', err => {
                callback(err, null);
            });
        })
            .on('error', err => {
            callback(err, null);
        });
        req.end(requestData);
    };
    return rpcImpl;
}
exports.createProtobufRPCImpl = createProtobufRPCImpl;
function createJSONRPCImpl(params) {
    return function doJSONRequest(obj, methodName) {
        const json = JSON.stringify(obj);
        return new Promise((resolve, reject) => {
            const chunks = [];
            const req = http_1.default
                .request({
                hostname: params.host,
                port: params.port,
                path: params.path + methodName,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': json.length,
                },
            }, res => {
                res.on('data', chunk => chunks.push(chunk));
                res.on('end', () => {
                    const data = Buffer.concat(chunks);
                    if (res.statusCode != 200) {
                        reject(getTwirpError(data));
                    }
                    else {
                        resolve(jsonToMessageProperties(data));
                    }
                });
                res.on('error', err => {
                    reject(err);
                });
            })
                .on('error', err => {
                reject(err);
            });
            req.end(json);
        });
    };
}
exports.createJSONRPCImpl = createJSONRPCImpl;
function getTwirpError(data) {
    const json = JSON.parse(data.toString());
    const error = new Error(json.msg);
    error.name = json.code;
    return error;
}
function jsonToMessageProperties(buffer) {
    const json = buffer.toString();
    const obj = JSON.parse(json);
    return camelCaseKeys(obj);
}
exports.jsonToMessageProperties = jsonToMessageProperties;
function camelCaseKeys(obj) {
    let newObj;
    if (Array.isArray(obj)) {
        return obj.map(value => {
            if (isJSONObject(value)) {
                value = camelCaseKeys(value);
            }
            return value;
        });
    }
    else {
        newObj = {};
        for (const [key, value] of Object.entries(obj)) {
            let camelizedValue = value;
            if (isJSONObject(value)) {
                camelizedValue = camelCaseKeys(value);
            }
            newObj[protobufjs_1.util.camelCase(key)] = camelizedValue;
        }
    }
    return newObj;
}
function isJSONObject(value) {
    return Array.isArray(value) || (value !== null && typeof value === 'object');
}
