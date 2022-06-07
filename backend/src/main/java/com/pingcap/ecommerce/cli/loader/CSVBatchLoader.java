package com.pingcap.ecommerce.cli.loader;

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

  private final CSVPrinter csvPrinter;

  public CSVBatchLoader(String filename, String[] headers) throws IOException {
    BufferedWriter writer = Files.newBufferedWriter(Paths.get(filename));
    this.csvPrinter = new CSVPrinter(writer, CSVFormat.DEFAULT.withHeader(headers));
  }

  synchronized public void insertValues(List<Object> values) throws IOException {
    this.csvPrinter.printRecord(values);
  }

  public void flush() throws IOException {
    this.csvPrinter.flush();
  }

  public void close() throws IOException {
    this.flush();
    this.csvPrinter.close();
  }

}
