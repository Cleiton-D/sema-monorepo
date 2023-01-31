package br.net.diarioescolar.service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Date;

import br.net.diarioescolar.builder.FinalResultBuilder;
import br.net.diarioescolar.dto.FinalResultDTO;
import br.net.diarioescolar.dto.GenerateFinalResultDTO;
import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperPrint;

public class FinalResultService {
  public ByteArrayOutputStream generate(GenerateFinalResultDTO data) throws JRException, IOException {
    JasperPrint finalReport = new FinalResultBuilder<FinalResultDTO>()
      .setList(data.getFinalResult())
      .setParam("school_name", data.getSchoolName())
      .setParam("reference_year", data.getReferenceYear())
      .setParam("current_date", new Date())
      .setParam("grade", data.getGrade())
      .setParam("classroom", data.getClassroom())
      .setParam("class_period", data.getClassPeriod())
      .build();

    ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
    JasperExportManager.exportReportToPdfStream(finalReport, byteArrayOutputStream);

    byteArrayOutputStream.flush();
    byteArrayOutputStream.close();
  
    return byteArrayOutputStream;
  }
}
