import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import fetch from "node-fetch";
import dotenv from "dotenv";
import ora from "ora";

const postTelemetry = async ({
  accessToken,
  tbHost,
  tbPort,
  iterations,
  delay,
}) => {
  let iterator = 0;

  const spinner = ora("Posting telemetry").start();

  const formatOra = () =>
    `Posting telemetry with ${delay}ms delay: ${
      iterations ? `${iterator + 1}/${iterations}` : iterator + 1
    }`;

  try {
    while (!iterations || iterator < iterations) {
      spinner.text = formatOra(iterator, iterations);

      await fetch(
        `http://${tbHost}:${tbPort}/api/v1/${accessToken}/telemetry`,
        {
          method: "post",
          body: JSON.stringify({ value: iterator }),
          headers: { "Content-Type": "application/json" },
        }
      );

      await new Promise((resolve) => setTimeout(resolve, delay));

      iterator++;
    }

    spinner.succeed("Test complete.");
  } catch (error) {
    spinner.fail(`Test failed: ${error.message}`);
  }
};

dotenv.config();

yargs(hideBin(process.argv))
  .scriptName("post-telemetry")
  .usage("$0 accessToken")
  .command(
    "$0",
    "Post telemetry to an accses token.",
    (yargs) =>
      yargs
        .env("TEST_BENCH")
        .demand("accessToken")
        .option("tbHost", {
          default: "localhost",
        })
        .option("tbPort", {
          default: "8080",
        })
        .option("iterations", {
          description:
            "The number of test iterations to run.  When not supplied, test runs 10 times.",
          default: 10,
        })
        .option("delay", {
          description:
            "The number of milliseconds of delay between each telemetry post.",
          default: 250,
        }),
    postTelemetry
  )
  .help().argv;
