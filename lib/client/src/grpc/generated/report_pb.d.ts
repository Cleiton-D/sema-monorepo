// package: report
// file: report.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as google_protobuf_timestamp_pb from "google-protobuf/google/protobuf/timestamp_pb";

export class MinifiedAttendance extends jspb.Message { 
    getStudentName(): string;
    setStudentName(value: string): MinifiedAttendance;

    hasClassDate(): boolean;
    clearClassDate(): void;
    getClassDate(): google_protobuf_timestamp_pb.Timestamp | undefined;
    setClassDate(value?: google_protobuf_timestamp_pb.Timestamp): MinifiedAttendance;
    getAttendance(): boolean;
    setAttendance(value: boolean): MinifiedAttendance;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): MinifiedAttendance.AsObject;
    static toObject(includeInstance: boolean, msg: MinifiedAttendance): MinifiedAttendance.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: MinifiedAttendance, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): MinifiedAttendance;
    static deserializeBinaryFromReader(message: MinifiedAttendance, reader: jspb.BinaryReader): MinifiedAttendance;
}

export namespace MinifiedAttendance {
    export type AsObject = {
        studentName: string,
        classDate?: google_protobuf_timestamp_pb.Timestamp.AsObject,
        attendance: boolean,
    }
}

export class Class extends jspb.Message { 
    getClassdate(): string;
    setClassdate(value: string): Class;
    getTaughtcontent(): string;
    setTaughtcontent(value: string): Class;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Class.AsObject;
    static toObject(includeInstance: boolean, msg: Class): Class.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Class, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Class;
    static deserializeBinaryFromReader(message: Class, reader: jspb.BinaryReader): Class;
}

export namespace Class {
    export type AsObject = {
        classdate: string,
        taughtcontent: string,
    }
}

export class SchoolTermSchoolReports extends jspb.Message { 
    getSchoolsubject(): string;
    setSchoolsubject(value: string): SchoolTermSchoolReports;
    getSchoolsubjectorder(): number;
    setSchoolsubjectorder(value: number): SchoolTermSchoolReports;
    getStudentname(): string;
    setStudentname(value: string): SchoolTermSchoolReports;
    getAverage(): string;
    setAverage(value: string): SchoolTermSchoolReports;

    hasAbsences(): boolean;
    clearAbsences(): void;
    getAbsences(): number | undefined;
    setAbsences(value: number): SchoolTermSchoolReports;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SchoolTermSchoolReports.AsObject;
    static toObject(includeInstance: boolean, msg: SchoolTermSchoolReports): SchoolTermSchoolReports.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SchoolTermSchoolReports, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SchoolTermSchoolReports;
    static deserializeBinaryFromReader(message: SchoolTermSchoolReports, reader: jspb.BinaryReader): SchoolTermSchoolReports;
}

export namespace SchoolTermSchoolReports {
    export type AsObject = {
        schoolsubject: string,
        schoolsubjectorder: number,
        studentname: string,
        average: string,
        absences?: number,
    }
}

export class SchoolTermItems extends jspb.Message { 
    getSchoolterm(): string;
    setSchoolterm(value: string): SchoolTermItems;

    hasSchooltermend(): boolean;
    clearSchooltermend(): void;
    getSchooltermend(): google_protobuf_timestamp_pb.Timestamp | undefined;
    setSchooltermend(value?: google_protobuf_timestamp_pb.Timestamp): SchoolTermItems;
    clearAttendancesList(): void;
    getAttendancesList(): Array<MinifiedAttendance>;
    setAttendancesList(value: Array<MinifiedAttendance>): SchoolTermItems;
    addAttendances(value?: MinifiedAttendance, index?: number): MinifiedAttendance;
    clearClassesList(): void;
    getClassesList(): Array<Class>;
    setClassesList(value: Array<Class>): SchoolTermItems;
    addClasses(value?: Class, index?: number): Class;
    clearSchoolreportList(): void;
    getSchoolreportList(): Array<SchoolTermSchoolReports>;
    setSchoolreportList(value: Array<SchoolTermSchoolReports>): SchoolTermItems;
    addSchoolreport(value?: SchoolTermSchoolReports, index?: number): SchoolTermSchoolReports;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SchoolTermItems.AsObject;
    static toObject(includeInstance: boolean, msg: SchoolTermItems): SchoolTermItems.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SchoolTermItems, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SchoolTermItems;
    static deserializeBinaryFromReader(message: SchoolTermItems, reader: jspb.BinaryReader): SchoolTermItems;
}

export namespace SchoolTermItems {
    export type AsObject = {
        schoolterm: string,
        schooltermend?: google_protobuf_timestamp_pb.Timestamp.AsObject,
        attendancesList: Array<MinifiedAttendance.AsObject>,
        classesList: Array<Class.AsObject>,
        schoolreportList: Array<SchoolTermSchoolReports.AsObject>,
    }
}

export class SchoolSubjectClassDiary extends jspb.Message { 
    getSchoolsubject(): string;
    setSchoolsubject(value: string): SchoolSubjectClassDiary;
    getTeacher(): string;
    setTeacher(value: string): SchoolSubjectClassDiary;
    getWorkload(): number;
    setWorkload(value: number): SchoolSubjectClassDiary;
    clearByschooltermList(): void;
    getByschooltermList(): Array<SchoolTermItems>;
    setByschooltermList(value: Array<SchoolTermItems>): SchoolSubjectClassDiary;
    addByschoolterm(value?: SchoolTermItems, index?: number): SchoolTermItems;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SchoolSubjectClassDiary.AsObject;
    static toObject(includeInstance: boolean, msg: SchoolSubjectClassDiary): SchoolSubjectClassDiary.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SchoolSubjectClassDiary, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SchoolSubjectClassDiary;
    static deserializeBinaryFromReader(message: SchoolSubjectClassDiary, reader: jspb.BinaryReader): SchoolSubjectClassDiary;
}

export namespace SchoolSubjectClassDiary {
    export type AsObject = {
        schoolsubject: string,
        teacher: string,
        workload: number,
        byschooltermList: Array<SchoolTermItems.AsObject>,
    }
}

export class Enrollment extends jspb.Message { 
    getStudentName(): string;
    setStudentName(value: string): Enrollment;
    getEnrollDate(): string;
    setEnrollDate(value: string): Enrollment;
    getGender(): string;
    setGender(value: string): Enrollment;
    getOrigin(): string;
    setOrigin(value: string): Enrollment;
    getBreed(): string;
    setBreed(value: string): Enrollment;
    getBirthDate(): string;
    setBirthDate(value: string): Enrollment;
    getAge(): string;
    setAge(value: string): Enrollment;
    getTransferDate(): string;
    setTransferDate(value: string): Enrollment;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Enrollment.AsObject;
    static toObject(includeInstance: boolean, msg: Enrollment): Enrollment.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Enrollment, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Enrollment;
    static deserializeBinaryFromReader(message: Enrollment, reader: jspb.BinaryReader): Enrollment;
}

export namespace Enrollment {
    export type AsObject = {
        studentName: string,
        enrollDate: string,
        gender: string,
        origin: string,
        breed: string,
        birthDate: string,
        age: string,
        transferDate: string,
    }
}

export class FinalResult extends jspb.Message { 
    getStudentname(): string;
    setStudentname(value: string): FinalResult;
    getSchoolsubject(): string;
    setSchoolsubject(value: string): FinalResult;
    getSchoolsubjectorder(): number;
    setSchoolsubjectorder(value: number): FinalResult;
    getFinalresult(): string;
    setFinalresult(value: string): FinalResult;
    getAverage(): string;
    setAverage(value: string): FinalResult;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): FinalResult.AsObject;
    static toObject(includeInstance: boolean, msg: FinalResult): FinalResult.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: FinalResult, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): FinalResult;
    static deserializeBinaryFromReader(message: FinalResult, reader: jspb.BinaryReader): FinalResult;
}

export namespace FinalResult {
    export type AsObject = {
        studentname: string,
        schoolsubject: string,
        schoolsubjectorder: number,
        finalresult: string,
        average: string,
    }
}

export class ClassDiaryGenerateRequest extends jspb.Message { 
    clearItemsList(): void;
    getItemsList(): Array<SchoolSubjectClassDiary>;
    setItemsList(value: Array<SchoolSubjectClassDiary>): ClassDiaryGenerateRequest;
    addItems(value?: SchoolSubjectClassDiary, index?: number): SchoolSubjectClassDiary;
    clearEnrollsList(): void;
    getEnrollsList(): Array<Enrollment>;
    setEnrollsList(value: Array<Enrollment>): ClassDiaryGenerateRequest;
    addEnrolls(value?: Enrollment, index?: number): Enrollment;
    clearFinalresultList(): void;
    getFinalresultList(): Array<FinalResult>;
    setFinalresultList(value: Array<FinalResult>): ClassDiaryGenerateRequest;
    addFinalresult(value?: FinalResult, index?: number): FinalResult;
    getSchoolname(): string;
    setSchoolname(value: string): ClassDiaryGenerateRequest;
    getReferenceyear(): string;
    setReferenceyear(value: string): ClassDiaryGenerateRequest;
    getGrade(): string;
    setGrade(value: string): ClassDiaryGenerateRequest;
    getClassroom(): string;
    setClassroom(value: string): ClassDiaryGenerateRequest;
    getClassperiod(): string;
    setClassperiod(value: string): ClassDiaryGenerateRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ClassDiaryGenerateRequest.AsObject;
    static toObject(includeInstance: boolean, msg: ClassDiaryGenerateRequest): ClassDiaryGenerateRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ClassDiaryGenerateRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ClassDiaryGenerateRequest;
    static deserializeBinaryFromReader(message: ClassDiaryGenerateRequest, reader: jspb.BinaryReader): ClassDiaryGenerateRequest;
}

export namespace ClassDiaryGenerateRequest {
    export type AsObject = {
        itemsList: Array<SchoolSubjectClassDiary.AsObject>,
        enrollsList: Array<Enrollment.AsObject>,
        finalresultList: Array<FinalResult.AsObject>,
        schoolname: string,
        referenceyear: string,
        grade: string,
        classroom: string,
        classperiod: string,
    }
}

export class ClassDiaryGenerateResponse extends jspb.Message { 
    getFilechunk(): Uint8Array | string;
    getFilechunk_asU8(): Uint8Array;
    getFilechunk_asB64(): string;
    setFilechunk(value: Uint8Array | string): ClassDiaryGenerateResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ClassDiaryGenerateResponse.AsObject;
    static toObject(includeInstance: boolean, msg: ClassDiaryGenerateResponse): ClassDiaryGenerateResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ClassDiaryGenerateResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ClassDiaryGenerateResponse;
    static deserializeBinaryFromReader(message: ClassDiaryGenerateResponse, reader: jspb.BinaryReader): ClassDiaryGenerateResponse;
}

export namespace ClassDiaryGenerateResponse {
    export type AsObject = {
        filechunk: Uint8Array | string,
    }
}
