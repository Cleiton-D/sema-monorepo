package br.net.diarioescolar.service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Date;
import java.util.List;

import br.net.diarioescolar.builder.FinalResultBuilder;
import br.net.diarioescolar.dto.FinalResultDTO;
import br.net.diarioescolar.dto.GenerateFinalResultDTO;
import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.export.ooxml.JRXlsxExporter;
import net.sf.jasperreports.export.SimpleExporterInput;
import net.sf.jasperreports.export.SimpleOutputStreamExporterOutput;

public class FinalResultService {
  public ByteArrayOutputStream generate(GenerateFinalResultDTO data, String extension) throws JRException, IOException {
    JasperPrint finalReport = new FinalResultBuilder<FinalResultDTO>()
      .setList(data.getFinalResult())
      .setParam("school_name", data.getSchoolName())
      .setParam("reference_year", data.getReferenceYear())
      .setParam("school_year_end_date", data.getSchoolYearEndDate())
      .setParam("grade", data.getGrade())
      .setParam("classroom", data.getClassroom())
      .setParam("class_period", data.getClassPeriod())
      .build();

    ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();

    if (extension.equals("pdf")) {
      JasperExportManager.exportReportToPdfStream(finalReport, byteArrayOutputStream);
    } else if (extension.equals("xlsx")) {
      JRXlsxExporter exporter = new JRXlsxExporter();
      exporter.setExporterInput(SimpleExporterInput.getInstance(List.of(finalReport)));
      exporter.setExporterOutput(new SimpleOutputStreamExporterOutput(byteArrayOutputStream));

      exporter.exportReport();
    } else {
      throw new Error("invalid file extension");
    }
    JasperExportManager.exportReportToPdfStream(finalReport, byteArrayOutputStream);

    byteArrayOutputStream.flush();
    byteArrayOutputStream.close();
  
    return byteArrayOutputStream;
  }
}
