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


const listProject = `https://245e520b-1e42-45b6-a7b3-94fb84ed0f9e@api.glitch.com/git/viridian-celestial-dinosaur|https://245e520b-1e42-45b6-a7b3-94fb84ed0f9e@api.glitch.com/git/pyrite-superb-pantry|https://245e520b-1e42-45b6-a7b3-94fb84ed0f9e@api.glitch.com/git/extreme-nebula-typhoon|https://245e520b-1e42-45b6-a7b3-94fb84ed0f9e@api.glitch.com/git/quixotic-quilled-odometer|https://245e520b-1e42-45b6-a7b3-94fb84ed0f9e@api.glitch.com/git/jeweled-heavy-approach|https://245e520b-1e42-45b6-a7b3-94fb84ed0f9e@api.glitch.com/git/marbled-peaceful-walkover|https://245e520b-1e42-45b6-a7b3-94fb84ed0f9e@api.glitch.com/git/wakeful-topaz-limpet|https://245e520b-1e42-45b6-a7b3-94fb84ed0f9e@api.glitch.com/git/legendary-simple-serpent|https://245e520b-1e42-45b6-a7b3-94fb84ed0f9e@api.glitch.com/git/empty-liberating-soap|https://245e520b-1e42-45b6-a7b3-94fb84ed0f9e@api.glitch.com/git/sudden-pine-salary|https://245e520b-1e42-45b6-a7b3-94fb84ed0f9e@api.glitch.com/git/meadow-tinted-swing|https://245e520b-1e42-45b6-a7b3-94fb84ed0f9e@api.glitch.com/git/tasty-deadpan-hortensia|https://245e520b-1e42-45b6-a7b3-94fb84ed0f9e@api.glitch.com/git/languid-cord-wolfsbane|https://245e520b-1e42-45b6-a7b3-94fb84ed0f9e@api.glitch.com/git/curse-plum-nova`.trim().split('|');

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