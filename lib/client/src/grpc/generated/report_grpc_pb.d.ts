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

interface IClassDiaryService_IGenerate extends grpc.MethodDefinition<report_pb.ClassDiaryGenerateRequest, report_pb.FileResponse> {
    path: "/report.ClassDiary/Generate";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<report_pb.ClassDiaryGenerateRequest>;
    requestDeserialize: grpc.deserialize<report_pb.ClassDiaryGenerateRequest>;
    responseSerialize: grpc.serialize<report_pb.FileResponse>;
    responseDeserialize: grpc.deserialize<report_pb.FileResponse>;
}

export const ClassDiaryService: IClassDiaryService;

export interface IClassDiaryServer extends grpc.UntypedServiceImplementation {
    generate: grpc.handleUnaryCall<report_pb.ClassDiaryGenerateRequest, report_pb.FileResponse>;
}

export interface IClassDiaryClient {
    generate(request: report_pb.ClassDiaryGenerateRequest, callback: (error: grpc.ServiceError | null, response: report_pb.FileResponse) => void): grpc.ClientUnaryCall;
    generate(request: report_pb.ClassDiaryGenerateRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: report_pb.FileResponse) => void): grpc.ClientUnaryCall;
    generate(request: report_pb.ClassDiaryGenerateRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: report_pb.FileResponse) => void): grpc.ClientUnaryCall;
}

export class ClassDiaryClient extends grpc.Client implements IClassDiaryClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public generate(request: report_pb.ClassDiaryGenerateRequest, callback: (error: grpc.ServiceError | null, response: report_pb.FileResponse) => void): grpc.ClientUnaryCall;
    public generate(request: report_pb.ClassDiaryGenerateRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: report_pb.FileResponse) => void): grpc.ClientUnaryCall;
    public generate(request: report_pb.ClassDiaryGenerateRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: report_pb.FileResponse) => void): grpc.ClientUnaryCall;
}

interface IFinalResultServiceService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    generate: IFinalResultServiceService_IGenerate;
}

interface IFinalResultServiceService_IGenerate extends grpc.MethodDefinition<report_pb.FinalResultGenerateRequest, report_pb.FileResponse> {
    path: "/report.FinalResultService/Generate";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<report_pb.FinalResultGenerateRequest>;
    requestDeserialize: grpc.deserialize<report_pb.FinalResultGenerateRequest>;
    responseSerialize: grpc.serialize<report_pb.FileResponse>;
    responseDeserialize: grpc.deserialize<report_pb.FileResponse>;
}

export const FinalResultServiceService: IFinalResultServiceService;

export interface IFinalResultServiceServer extends grpc.UntypedServiceImplementation {
    generate: grpc.handleUnaryCall<report_pb.FinalResultGenerateRequest, report_pb.FileResponse>;
}

export interface IFinalResultServiceClient {
    generate(request: report_pb.FinalResultGenerateRequest, callback: (error: grpc.ServiceError | null, response: report_pb.FileResponse) => void): grpc.ClientUnaryCall;
    generate(request: report_pb.FinalResultGenerateRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: report_pb.FileResponse) => void): grpc.ClientUnaryCall;
    generate(request: report_pb.FinalResultGenerateRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: report_pb.FileResponse) => void): grpc.ClientUnaryCall;
}

export class FinalResultServiceClient extends grpc.Client implements IFinalResultServiceClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public generate(request: report_pb.FinalResultGenerateRequest, callback: (error: grpc.ServiceError | null, response: report_pb.FileResponse) => void): grpc.ClientUnaryCall;
    public generate(request: report_pb.FinalResultGenerateRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: report_pb.FileResponse) => void): grpc.ClientUnaryCall;
    public generate(request: report_pb.FinalResultGenerateRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: report_pb.FileResponse) => void): grpc.ClientUnaryCall;
}
