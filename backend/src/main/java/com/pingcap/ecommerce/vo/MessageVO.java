package com.pingcap.ecommerce.vo;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.http.HttpStatus;
import org.springframework.util.StopWatch;

@Data
@AllArgsConstructor
public class MessageVO<T> {

    public static final int SUCCESS = HttpStatus.OK.value();

    private int status;

    private String message;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private T data;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Double cost;

    public MessageVO(int status, String message) {
        this.status = status;
        this.message = message;
    }

    public static MessageVO<?> of(int code, String message) {
        return new MessageVO<>(code, message);
    }

    public static MessageVO<?> of(int code, String message, Object data) {
        return new MessageVO<>(code, message, data, null);
    }

    public static MessageVO<?> success() {
        return new MessageVO<>(SUCCESS, "success");
    }

    public static MessageVO<?> successWithCost(Double cost) {
        return new MessageVO<>(SUCCESS, "success", null, cost);
    }

    public static MessageVO<?> success(Object data) {
        return new MessageVO<>(0, "success", data, null);
    }

    public static MessageVO<?> stopWatchWrapper(Runnable runnable) {
        StopWatch sw = new StopWatch();
        sw.start();
        runnable.run();
        sw.stop();
        return MessageVO.successWithCost(sw.getTotalTimeSeconds());
    }

}
