const upload_Md = require('./git-push.js');
const createNew_Md = require('./newCreate.js')
const shell = require('shelljs')
const queryString = require('query-string');
const axios = require("axios").default;
const axiosRetry = require('axios-retry');

setTimeout(() => {
  console.log('force exit');
  process.exit(0)
}, 30 * 60 * 1000);

axiosRetry(axios, {
  retries: 100,
  retryDelay: (retryCount) => {
    // console.log(`retry attempt: ${retryCount}`);
    return 3000 || retryCount * 1000;
  },
  retryCondition: (error) => {
    return error.response.status === 502;
  },
});


const listProject = `https://d02a77bd-a3be-45ed-81e1-a3c3e1392e58@api.glitch.com/git/spiritual-caterwauling-echidna|https://d02a77bd-a3be-45ed-81e1-a3c3e1392e58@api.glitch.com/git/puzzled-dent-cuckoo|https://d02a77bd-a3be-45ed-81e1-a3c3e1392e58@api.glitch.com/git/cautious-glossy-stoplight|https://d02a77bd-a3be-45ed-81e1-a3c3e1392e58@api.glitch.com/git/river-dynamic-dress|https://d02a77bd-a3be-45ed-81e1-a3c3e1392e58@api.glitch.com/git/warp-plant-banana|https://d02a77bd-a3be-45ed-81e1-a3c3e1392e58@api.glitch.com/git/lumpy-hilarious-turret|https://d02a77bd-a3be-45ed-81e1-a3c3e1392e58@api.glitch.com/git/resisted-dramatic-freckle|https://d02a77bd-a3be-45ed-81e1-a3c3e1392e58@api.glitch.com/git/quaint-incredible-grin|https://d02a77bd-a3be-45ed-81e1-a3c3e1392e58@api.glitch.com/git/rounded-radial-honeycrisp|https://d02a77bd-a3be-45ed-81e1-a3c3e1392e58@api.glitch.com/git/airy-experienced-snowman|https://d02a77bd-a3be-45ed-81e1-a3c3e1392e58@api.glitch.com/git/mellow-bush-bison|https://d02a77bd-a3be-45ed-81e1-a3c3e1392e58@api.glitch.com/git/tremendous-repeated-volcano|https://d02a77bd-a3be-45ed-81e1-a3c3e1392e58@api.glitch.com/git/bow-lead-brick|https://d02a77bd-a3be-45ed-81e1-a3c3e1392e58@api.glitch.com/git/walnut-savory-element`.trim().split('|');

const delay = t => {
  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve(true);
    }, t);
  });
};

(async () => {
  try {
    let accountNumber = 0;

    for (let i = 0; i < listProject.length; i++) {
      accountNumber = i + 1;
      try {
        const nameProject = listProject[i].split('/')[4]
        console.log('deploy', nameProject);
        createNew_Md.run(nameProject)
        await upload_Md.upload2Git(listProject[i].trim(), 'code4Delpoy');
        console.log(`account ${accountNumber} upload success ^_^`);

        axios
          .get(`https://eager-profuse-python.glitch.me/deploy?${queryString.stringify({
            email: listProject[i].trim() + ' true'
          })}`)
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            if (error.response) {
              console.log(error.response.data);
            } else {
              console.log('Loi');
            }
          });

        if (i + 1 < listProject.length) await delay(1.8 * 60 * 1000);
      } catch (error) {
        console.log(`account ${accountNumber} upload fail ^_^`);
        axios
          .get(`https://eager-profuse-python.glitch.me/deploy?${queryString.stringify({
            email: listProject[i].trim() + ' false'
          })}`)
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            if (error.response) {
              console.log(error.response.data);
            } else {
              console.log('Loi');
            }
          });
      }

      if (process.cwd().includes('code4Delpoy')) shell.cd('../', { silent: true });

    }

    await delay(20000)
    console.log('Done! exit')
    process.exit(0)

  } catch (err) {
    console.log(`error: ${err}`);
  }
})();