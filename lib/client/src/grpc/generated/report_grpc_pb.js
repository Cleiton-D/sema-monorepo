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

function serialize_report_ClassDiaryGenerateResponse(arg) {
  if (!(arg instanceof report_pb.ClassDiaryGenerateResponse)) {
    throw new Error('Expected argument of type report.ClassDiaryGenerateResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_report_ClassDiaryGenerateResponse(buffer_arg) {
  return report_pb.ClassDiaryGenerateResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var ClassDiaryService = exports.ClassDiaryService = {
  generate: {
    path: '/report.ClassDiary/Generate',
    requestStream: false,
    responseStream: false,
    requestType: report_pb.ClassDiaryGenerateRequest,
    responseType: report_pb.ClassDiaryGenerateResponse,
    requestSerialize: serialize_report_ClassDiaryGenerateRequest,
    requestDeserialize: deserialize_report_ClassDiaryGenerateRequest,
    responseSerialize: serialize_report_ClassDiaryGenerateResponse,
    responseDeserialize: deserialize_report_ClassDiaryGenerateResponse,
  },
};

exports.ClassDiaryClient = grpc.makeGenericClientConstructor(ClassDiaryService);
