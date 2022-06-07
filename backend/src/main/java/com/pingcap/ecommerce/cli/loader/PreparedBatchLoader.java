package com.pingcap.ecommerce.cli.loader;

import java.math.BigDecimal;
import java.sql.*;
import java.util.List;

public class PreparedBatchLoader implements BatchLoader {

  private int bulkSize = 2000;

  private final PreparedStatement pstmt;

  private int count = 0;

  public PreparedBatchLoader(Connection conn, String insertHint) throws SQLException {
    this.pstmt = conn.prepareStatement(insertHint);
  }

  public void insertValues(List<Object> values) throws Exception {
    for (int i = 0; i < values.size(); i++) {
      int index = i + 1;
      Object value = values.get(i);

      if (value instanceof String) {
        pstmt.setString(index, (String) value);
      } else if (value instanceof Integer) {
        pstmt.setInt(index, (Integer) value);
      } else if (value instanceof Long) {
        pstmt.setLong(index, (Long) value);
      } else if (value instanceof BigDecimal) {
        pstmt.setBigDecimal(index, (BigDecimal) value);
      } else if (value instanceof Date) {
        pstmt.setDate(index, (Date) value);
      } else if (value instanceof Boolean) {
        pstmt.setBoolean(index, (Boolean) value);
      } else {
        pstmt.setObject(index, value);
      }
    }

    pstmt.addBatch();

    this.count++;
    if (this.count >= bulkSize) {
      this.flush();
    }
  }

  public void bulkSize(int bulkSize) {
    this.bulkSize = bulkSize;
  }

  public void flush() throws SQLException {
    pstmt.executeBatch();
    this.count = 0;
  }

  public void close() throws SQLException {
    this.flush();
    pstmt.close();
  }

}
