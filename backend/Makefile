# Copyright 2022 PingCAP, Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

ifneq (,$(wildcard ./.env))
    include .env
    export
endif

base_url=http://localhost:8080/api

.PHONY: build-app run

build-app:
	mvn clean package -DskipTests

run: build-app
	java -jar target/tidb-ecommerce-demo-app.jar -Djdk.module.illegalAccess=permit --add-opens=java.base/java.nio=ALL-UNNAMED

calc-user-labels:
	curl -X POST "${base_url}/data/user-labels/calc"

pull-back-user-labels:
	curl -X POST "${base_url}/data/user-labels/pull-back"

calc-high-label-items:
	curl -X POST "${base_url}/data/hot-items/high-label/calc"

calc-low-label-items:
	curl -X POST "${base_url}/api/data/hot-items/low-label/calc"

pull-back-hot-items:
	curl -X POST "${base_url}/data/hot-items/pull-back"