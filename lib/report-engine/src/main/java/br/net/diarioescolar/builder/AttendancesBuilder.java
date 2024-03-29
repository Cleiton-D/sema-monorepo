package br.net.diarioescolar.builder;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import net.sf.jasperreports.engine.JREmptyDataSource;
import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;


public class AttendancesBuilder<T> {
  private Map<String, Object> params = new HashMap<String, Object>();
  private List<T> list = new ArrayList<T>();

  public AttendancesBuilder<T> setList(List<T> list) {
    this.list = list;
    return this;
  }

  public AttendancesBuilder<T> addItem(T item) {
    this.list.add(item);
    return this;
  }

  public AttendancesBuilder<T> setParam(String key, Object value) {
    this.params.put(key, value);
    return this;
  }

  public JasperPrint build() throws JRException {
    JRBeanCollectionDataSource dataSource = new JRBeanCollectionDataSource(this.list);

    this.params.put("attendanceDataSource", dataSource);

    JasperPrint page = JasperFillManager.fillReport("reports/attendances.jasper", this.params, new JREmptyDataSource());
    page.setName("Relatório de presença");

    return page;
  }
}
