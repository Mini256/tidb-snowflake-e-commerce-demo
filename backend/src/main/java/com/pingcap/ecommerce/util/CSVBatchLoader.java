package com.pingcap.ecommerce.util;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;

import java.io.BufferedWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.List;

public class CSVBatchLoader implements BatchLoader {

  private static final ThreadLocal<SimpleDateFormat> sdf = ThreadLocal.withInitial(
      () -> new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssZ")
  );

  private CSVPrinter csvPrinter;

  public CSVBatchLoader(String filename, String[] headers) throws IOException {
    BufferedWriter writer = Files.newBufferedWriter(Paths.get(filename));
    this.csvPrinter = new CSVPrinter(writer, CSVFormat.DEFAULT.withHeader(headers));
  }

  synchronized public void insertValues(List<Object> values) throws IOException {
//    List<String> dataRow = new ArrayList<>();
//    for (int i = 0; i < values.size(); i++) {
//      Object value = values.get(i);
//
//      if (value instanceof String) {
//        // dataRow.add(String.format("\"%s\"", value));
//        dataRow.add((String) value);
//      } else if (value instanceof Integer) {
//        dataRow.add(Integer.toString((Integer) value));
//      } else if (value instanceof Long) {
//        dataRow.add(Long.toString((Long) value));
//      } else if (value instanceof BigDecimal) {
//        dataRow.add(value.toString());
//      } else if (value instanceof Date) {
//        SimpleDateFormat sdf = CSVBatchLoader.sdf.get();
//        // dataRow.add(String.format("\"%s\"", sdf.format((Date) value)));
//        dataRow.add(sdf.format((Date) value));
//      } else if (value instanceof Boolean) {
//        dataRow.add(Boolean.toString(((Boolean) value)));
//      } else if (value == null){
//        dataRow.add("NULL");
//      } else {
//        dataRow.add(value.toString());
//      }
//    }

    this.csvPrinter.printRecord(values);
  }

  public void flush() throws IOException {
    this.csvPrinter.flush();
  }

  public void close() throws IOException {
    this.flush();
//    this.csv.close();
    this.csvPrinter.close();
  }

}
