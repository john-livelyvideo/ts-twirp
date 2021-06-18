/// <reference types="node" />
import { RPCImpl } from 'protobufjs';
interface CreateTwirpRPCImplParams {
    host: string;
    port: number;
    path: string;
}
export declare function createProtobufRPCImpl(params: CreateTwirpRPCImplParams): RPCImpl;
interface JSONReadyObject {
    toJSON: () => {
        [key: string]: unknown;
    };
}
export declare type JSONRPCImpl = (obj: JSONReadyObject, methodName: string) => Promise<{}>;
export declare function createJSONRPCImpl(params: CreateTwirpRPCImplParams): JSONRPCImpl;
export declare function jsonToMessageProperties(buffer: Buffer): JSONObject;
declare type JSONObject = {
    [key: string]: unknown;
} | unknown[];
export {};
