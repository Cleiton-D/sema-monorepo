package br.net.diarioescolar.utils.mapper;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.Date;

import org.mapstruct.Mapper;

import com.google.protobuf.Timestamp;

@Mapper
public interface GrpcDateMapper {
  default Date convert(Timestamp timestamp) {
    LocalDate localClassDate = LocalDateTime.ofEpochSecond(
      timestamp.getSeconds(), 
      timestamp.getNanos(), 
      ZoneOffset.UTC
    ).toLocalDate();

    return Date.from(localClassDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
  }
}
