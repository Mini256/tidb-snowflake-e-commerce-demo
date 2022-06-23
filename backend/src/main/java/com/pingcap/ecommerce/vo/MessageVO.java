package com.pingcap.ecommerce.vo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MessageVO<T> {

    private int status;

    private String message;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private T data;

    public MessageVO(int status, String message) {
        this.status = status;
        this.message = message;
    }

    public static MessageVO<?> success() {
        return new MessageVO<>(0, "success");
    }

    public static MessageVO<?> success(Object data) {
        return new MessageVO<>(0, "success", data);
    }


}
