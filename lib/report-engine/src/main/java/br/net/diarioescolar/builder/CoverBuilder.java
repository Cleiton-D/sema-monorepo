package br.net.diarioescolar.builder;

import java.util.HashMap;
import java.util.Map;

import net.sf.jasperreports.engine.JREmptyDataSource;
import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;

public class CoverBuilder {
  private Map<String, Object> params;

  private CoverBuilder(Map<String, Object> params) {
    this.params = params;
  }

  public static CoverBuilder newBuilder() {
    return new CoverBuilder(new HashMap<String, Object>());
  }

  public CoverBuilder setParams(Map<String, Object> params) {
    this.params = params;
    return this;
  }

  public CoverBuilder setParam(String key, Object value) {
    this.params.put(key, value);
    return this;
  }
  
  public JasperPrint build() throws JRException {
    JasperPrint page = JasperFillManager.fillReport("reports/cover.jasper", this.params, new JREmptyDataSource());
    page.setName("Capa");

    return page;
  }
}
