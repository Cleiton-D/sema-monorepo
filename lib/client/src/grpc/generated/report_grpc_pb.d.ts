// package: report
// file: report.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as report_pb from "./report_pb";
import * as google_protobuf_timestamp_pb from "google-protobuf/google/protobuf/timestamp_pb";

interface IClassDiaryService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    generate: IClassDiaryService_IGenerate;
}

interface IClassDiaryService_IGenerate extends grpc.MethodDefinition<report_pb.ClassDiaryGenerateRequest, report_pb.ClassDiaryGenerateResponse> {
    path: "/report.ClassDiary/Generate";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<report_pb.ClassDiaryGenerateRequest>;
    requestDeserialize: grpc.deserialize<report_pb.ClassDiaryGenerateRequest>;
    responseSerialize: grpc.serialize<report_pb.ClassDiaryGenerateResponse>;
    responseDeserialize: grpc.deserialize<report_pb.ClassDiaryGenerateResponse>;
}

export const ClassDiaryService: IClassDiaryService;

export interface IClassDiaryServer extends grpc.UntypedServiceImplementation {
    generate: grpc.handleUnaryCall<report_pb.ClassDiaryGenerateRequest, report_pb.ClassDiaryGenerateResponse>;
}

export interface IClassDiaryClient {
    generate(request: report_pb.ClassDiaryGenerateRequest, callback: (error: grpc.ServiceError | null, response: report_pb.ClassDiaryGenerateResponse) => void): grpc.ClientUnaryCall;
    generate(request: report_pb.ClassDiaryGenerateRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: report_pb.ClassDiaryGenerateResponse) => void): grpc.ClientUnaryCall;
    generate(request: report_pb.ClassDiaryGenerateRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: report_pb.ClassDiaryGenerateResponse) => void): grpc.ClientUnaryCall;
}

export class ClassDiaryClient extends grpc.Client implements IClassDiaryClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public generate(request: report_pb.ClassDiaryGenerateRequest, callback: (error: grpc.ServiceError | null, response: report_pb.ClassDiaryGenerateResponse) => void): grpc.ClientUnaryCall;
    public generate(request: report_pb.ClassDiaryGenerateRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: report_pb.ClassDiaryGenerateResponse) => void): grpc.ClientUnaryCall;
    public generate(request: report_pb.ClassDiaryGenerateRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: report_pb.ClassDiaryGenerateResponse) => void): grpc.ClientUnaryCall;
}
