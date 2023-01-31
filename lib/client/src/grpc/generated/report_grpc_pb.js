// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var report_pb = require('./report_pb.js');
var google_protobuf_timestamp_pb = require('google-protobuf/google/protobuf/timestamp_pb.js');

function serialize_report_ClassDiaryGenerateRequest(arg) {
  if (!(arg instanceof report_pb.ClassDiaryGenerateRequest)) {
    throw new Error('Expected argument of type report.ClassDiaryGenerateRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_report_ClassDiaryGenerateRequest(buffer_arg) {
  return report_pb.ClassDiaryGenerateRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_report_FileResponse(arg) {
  if (!(arg instanceof report_pb.FileResponse)) {
    throw new Error('Expected argument of type report.FileResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_report_FileResponse(buffer_arg) {
  return report_pb.FileResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_report_FinalResultGenerateRequest(arg) {
  if (!(arg instanceof report_pb.FinalResultGenerateRequest)) {
    throw new Error('Expected argument of type report.FinalResultGenerateRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_report_FinalResultGenerateRequest(buffer_arg) {
  return report_pb.FinalResultGenerateRequest.deserializeBinary(new Uint8Array(buffer_arg));
}


var ClassDiaryService = exports.ClassDiaryService = {
  generate: {
    path: '/report.ClassDiary/Generate',
    requestStream: false,
    responseStream: false,
    requestType: report_pb.ClassDiaryGenerateRequest,
    responseType: report_pb.FileResponse,
    requestSerialize: serialize_report_ClassDiaryGenerateRequest,
    requestDeserialize: deserialize_report_ClassDiaryGenerateRequest,
    responseSerialize: serialize_report_FileResponse,
    responseDeserialize: deserialize_report_FileResponse,
  },
};

exports.ClassDiaryClient = grpc.makeGenericClientConstructor(ClassDiaryService);
var FinalResultServiceService = exports.FinalResultServiceService = {
  generate: {
    path: '/report.FinalResultService/Generate',
    requestStream: false,
    responseStream: false,
    requestType: report_pb.FinalResultGenerateRequest,
    responseType: report_pb.FileResponse,
    requestSerialize: serialize_report_FinalResultGenerateRequest,
    requestDeserialize: deserialize_report_FinalResultGenerateRequest,
    responseSerialize: serialize_report_FileResponse,
    responseDeserialize: deserialize_report_FileResponse,
  },
};

exports.FinalResultServiceClient = grpc.makeGenericClientConstructor(FinalResultServiceService);
