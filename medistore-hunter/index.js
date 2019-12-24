// https://github.com/yagop/node-telegram-bot-api/issues/484#issuecomment-354253361
process.env["NTBA_FIX_319"] = 1;

(async () => {
  require("dotenv").config({ path: __dirname + "/.env" });
  const fs = require("fs");
  const fetch = require("node-fetch");
  const TelegramBot = require("node-telegram-bot-api");

  // replace the value below with the Telegram token you receive from @BotFather
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (token === undefined) {
    throw "Missing Telegram token";
  }

  if (chatId === undefined) {
    throw "Missing Telegram chatId";
  }

  // Create a bot
  const bot = new TelegramBot(token);

  // const datesToCheck = ["2019-12-27", "2020-01-20"];
  const datesToCheck = ["2019-12-27"];

  try {
    for (const date of datesToCheck) {
      console.log(`${new Date()} Checking ${date}`);
      if (await hasAvailableVisits(date)) {
        await bot.sendMessage(chatId, date);
      }
    }

    async function hasAvailableVisits(date) {
      const [year, month, day] = date.split("-");

      const data = await getData({ day, month, year });
      const txt = getNoVisitsAvailableText({ day, month, year });

      if (data.html.includes("no-results-week")) {
        return false;
      }

      return !data.html.includes(txt);
    }
  } catch (err) {
    bot.sendMessage(chatId, "ERROR: " + JSON.stringify(err));
  }

  async function getData({ day, month, year }) {
    return getDataFromServer({ day, month, year });
    // return getDataFromFile({ day, month, year });
  }

  async function getDataFromServer({ day, month, year }) {
    const locationIds = [30, 31, 62, 107, 1959, 2007];
    const locationIdsStringified = locationIds
      .map(id => id.toString())
      .join("%2C");
    const productId = "3882";

    const res = await fetch(
      "https://www.medistore.com.pl/en/visits/appointment/searchajax/_secured/1/",
      {
        body: `region_id=205&location_ids=${locationIdsStringified}&date_from=${day}-${month}-${year}&product_id=${productId}`,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "X-Requested-With": "XMLHttpRequest"
        },
        method: "POST"
      }
    );
    const data = await res.json();

    fs.writeFileSync(
      `test-${year}-${month}-${day}.json`,
      JSON.stringify(data, null, 2)
    );

    return data;
  }

  async function getDataFromFile({ day, month, year }) {
    return JSON.parse(
      fs.readFileSync(`test-${year}-${month}-${day}.json`, "utf-8")
    );
  }

  function getNoVisitsAvailableText({ day, month, year }) {
    return `<span>${day}/${month}</span>\r\n                    <span class=\"h5\">${new Date(
      Date.UTC(year, month - 1, day)
    ).toLocaleDateString("en-US", {
      weekday: "long"
    })}</span>\r\n                                                                                                            <span>No available visits</span>`;
  }
})();
