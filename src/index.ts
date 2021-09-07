interface Config {
  type: String
  time: Number,
  count: Number,
}

const defaultConfig = {
  type: 'hover',
  time: 1000,
  count: 5,
}

const ShowGitVersion = (function () {
  const log = (info: string) => {
    console.log(info);
  }
  const logObj = (obj: Object) => {
    log(JSON.stringify(obj));
  }
  const logKeyValue = (key: string, value: string) => {
    console.log(
      `%c ${key} %c ${value} `,
      'padding: 1px; border-radius: 3px 0 0 3px; color: #fff; background: #606060;',
      'padding: 1px; border-radius: 0 3px 3px 0; color: #fff; background: #1475b2;'
    );
  }
  const version = () => {
    const {
      BUILD_TIME : buildTime = '',
      GIT_VERSION: gitVersion = '',
      GIT_BRANCH: gitBranch = '',
      GIT_COMMIT: gitCommit = '',
      PROJ_VERSION: projVersion = '',
    } = process.env;
    return { buildTime, gitVersion, gitBranch, gitCommit, projVersion };
  }
  const toggle = (() => {
    let eleTitle: string, innerHTML: string;
    return (ele: HTMLBaseElement, type: String, isOpen: Boolean, verInfo: any) => {
      const verStr = `构建时间:${verInfo.buildTime}，git提交hash:${verInfo.gitCommit}`;
      if (isOpen) {
        if (type === 'hover') {
          eleTitle = ele.getAttribute('title') || '';
          ele.setAttribute('title', verStr);
        } else if (type === 'replace') {
          innerHTML = ele.innerHTML || '';
          ele.innerHTML = verStr;
        }
      } else {
        if (type === 'hover') {
          ele.setAttribute('title', eleTitle);
        } else if (type === 'replace') {
          ele.innerHTML = innerHTML;
        }
      }
    }
  })()
  return {
    trace() {
      const { gitVersion, buildTime, gitCommit, projVersion } = version();
      if (buildTime) {
        logKeyValue('构建时间', buildTime);
        logKeyValue('提交哈希', gitCommit);
        logKeyValue('项目版本', projVersion);
      } else {
        logKeyValue('提交版本', gitVersion);
      }
    },
    info() {
      return version();
    },
    bind(ele: HTMLBaseElement, userConfig: Config) {
      let clickCount = 0;
      let isOpen = false;
      let startTime = 0;
      const config = {...defaultConfig, ...userConfig};
      const verInfo = version();
      ele.onclick = function () {
        // 首次点击初始化
        if (!startTime) {
          startTime = Date.now();
          clickCount = 1;
          return;
        }

        // 超出时间阈后重置
        if (Date.now() - startTime > config.time) {
          startTime = 0;
          clickCount = 0;
          return;
        }

        clickCount += 1;

        // 达到阈值条件后，触发后门
        if (clickCount === config.count) {
          clickCount = 0;
          startTime = 0;
          isOpen = !isOpen;
          toggle(ele, config.type, isOpen, verInfo);
        }
      }
    },
  };
})();

export default ShowGitVersion;
