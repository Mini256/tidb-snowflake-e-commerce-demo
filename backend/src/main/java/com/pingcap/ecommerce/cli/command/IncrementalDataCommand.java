package com.pingcap.ecommerce.cli.command;

import com.beust.jcommander.Parameter;
import com.beust.jcommander.Parameters;
import com.pingcap.ecommerce.cli.loader.ConcurrentBatchLoader;
import com.pingcap.ecommerce.cli.loader.ConcurrentCSVBatchLoader;
import com.pingcap.ecommerce.cli.loader.ConcurrentPreparedBatchLoader;
import com.pingcap.ecommerce.dao.tidb.UserMapper;
import com.pingcap.ecommerce.model.ExpressStatus;
import com.pingcap.ecommerce.model.Item;
import com.pingcap.ecommerce.model.Order;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ConfigurableApplicationContext;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.concurrent.ConcurrentSkipListSet;

import static net.andreinc.mockneat.types.enums.StringType.*;
import static net.andreinc.mockneat.unit.address.Addresses.addresses;
import static net.andreinc.mockneat.unit.objects.From.from;
import static net.andreinc.mockneat.unit.text.Markovs.markovs;
import static net.andreinc.mockneat.unit.text.Strings.strings;
import static net.andreinc.mockneat.unit.text.Words.words;
import static net.andreinc.mockneat.unit.time.LocalDates.localDates;
import static net.andreinc.mockneat.unit.types.Doubles.doubles;
import static net.andreinc.mockneat.unit.types.Ints.ints;
import static net.andreinc.mockneat.unit.types.Longs.longs;
import static net.andreinc.mockneat.unit.user.Passwords.passwords;
import static net.andreinc.mockneat.unit.user.Users.users;

@Slf4j
@Parameters(
    commandNames = { "incremental-data" },
    commandDescription = "Import incremental test data into database."
)
public class IncrementalDataCommand {

    private ConcurrentBatchLoader concurrentBatchLoader;

    public void incrementalData(ConfigurableApplicationContext ctx) {
        UserMapper userMapper = ctx.getBean(UserMapper.class);

    }
}
