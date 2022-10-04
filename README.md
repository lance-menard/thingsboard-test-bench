#### Build and run Thingsboard

Follow these guides:

- https://thingsboard.io/docs/user-guide/contribution/how-to-contribute/
- https://thingsboard.io/docs/user-guide/install/building-from-source/

In short:

- Clone (Thingsboard)[https://github.com/thingsboard/thingsboard]
- Install Java 11
- Install PostgreSQL
- Initialize dev DB
  - Note: When on Windows, use `application/target/windows/install_dev_db.bat`.
- Build jar: `mvn clean install -DskipTests`
- Start TB: `java -jar application/target/thingsboard-${VERSION}-boot.jar`
- Sign in: http://localhost:8080 / Username: tenant@thingsboard.org / PW: tenant

#### Configure TB for device attribute inefficiency

Inefficiency being tested:
`./rule-engine/rule-engine-components/src/main/java/org/thingsboard/rule/engine/util/EntitiesRelatedDeviceIdAsyncLoader.java:42`

1. Add relation to device

- http://localhost:8080/devices
- Select device Thermostat T1
- Open relations tab and click "plus"
- Select entity type = "Device" and entity = "Test Device A1"
- Click "Add"
  - Final attributes tab should look like the following:
    ![Thermostat T1 Relations](docs/Thermostat_T1_Relations.png?raw=true "Thermostat T1 Relations")

2. Add attributes node to thermostat rule chain

- http://localhost:8080/ruleChains
- Select Thermostat rule chain
- Select "Open rule chain"
- Drag a "related device attributes" node into the graph
- Fill in any name (e.g. Inefficiency Test)
  - No other fields need to be changed
- Click add
- Attach node to output of "Save Timeseries" node (on the Post telemetry branch)
- Select "Success" for link label
  - Final chain should look like the following:
    ![Thermostat rule chain](docs/Thermostat_Rule_Chain.png?raw=true "Thermostat rule chain")
- Click orange check in bottom right to save chain

#### Configure script

- Change TB host and port, iteration count, and delay if needed in `.env`
  - Iterations/delay also be passed as command-line arguments
- Install dependencies via `npm i`

#### Run script

- `node ./index.js`: Will repeatedly post telemetry to the Thermostat T1 device, causing the rule chain to look up information about the related device (Test Device A1).
