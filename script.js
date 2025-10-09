const user_input = document.querySelector("#user_input");
const show_data = document.querySelector("#show_data");

// everything starts here
// getting raw data
// converting raw data to good data
// counting freq of each name
let nameFreqLen = 0;
user_input.addEventListener("change", function () {
  //   console.log("inside function");
  //   console.log(user_input.value);
  user_input.scrollTop = 0;
  const rawNames = user_input.value;
  const namesArr = convertRawNameToGood(rawNames);
  const { freq: nameFreq, freqLen } = frqeCntNames(namesArr);
  // console.log(nameFreq, freqLen);
  nameFreqLen = freqLen;
  const data = showDataToScreen(nameFreq, "name");
  show_data.innerHTML = data;
});

// task
const task_input = document.querySelector("#task_input");
const show_task_data = document.querySelector("#show_task_data");

task_input.addEventListener("change", function () {
  task_input.scrollTop = 0;
  const rawTask = task_input.value;
  const taskArr = convertRawNameToGood(rawTask);
  const taskFreq = freqCntTask(taskArr);
  // console.log(taskFreq);
  const data = showDataToScreen(taskFreq, "task");
  show_task_data.innerHTML = data;
});

function freqCntTask(taskArr) {
  const freq = {};
  for (let task of taskArr) {
    if (
      task === "" ||
      task === "N/A" ||
      task === "Action to be taken" ||
      task === "With HID/OneApp/Mule" ||
      task === "Sent to business"
    )
      continue;
    if (
      task === "1st Reminder" ||
      task === "2nd Reminder" ||
      task === "3rd Reminder"
    ) {
      freq["reminder"] = (freq["reminder"] || 0) + 1;
    } else if (task === "If no reply today, Close it") {
      freq["close"] = (freq["close"] || 0) + 1;
    } else {
      freq[task] = (freq[task] || 0) + 1;
    }
  }
  return freq;
}

// convert raw name to new valid array
function convertRawNameToGood(rawName) {
  const namesArr = rawName
    .trim()
    .split("\n")
    .map((name) => name.trim());
  return namesArr;
}

// count how many name times each name appears
function frqeCntNames(namesArr) {
  const freq = {};
  let freqLen = 0;
  for (let name of namesArr) {
    if (name === "" || name === "N/A" || name === "Resource") continue;
    // freq[name] = (freq[name] || 0) + 1;
    // freqLen += 1;
    if (!freq[name]) {
      freqLen += 1;
      freq[name] = 1;
    } else {
      freq[name] += 1;
    }
  }
  // let freqLen = Object.keys(freq).length;
  return { freq, freqLen };
}

// accepting an obj and sort it according to frequency name
// and display output
function showDataToScreen(nameFreq, source) {
  const sortedNameCnt = Object.entries(nameFreq).sort((a, b) => b[1] - a[1]);

  let table = `
    <table border=1 cellspacing=0 cellpadding=5 style=width: 100%>
      <tbody>`;
  let id = 0;
  let totalCnt = 0;
  for (let [name, count] of sortedNameCnt) {
    // const id = name.split(" ")[0];
    name = shortName(name);
    id += 1;
    totalCnt += count;
    table += `
    <tr>
      <td>${id}</td>
      <td>${name}</td>
      
     ${
       source === "name"
         ? `<td><button onclick="inc('${id}')">+</button></td>`
         : ""
     }
      <td class="cnt" id=${"a" + id}>${count}</td>
     ${
       source === "name"
         ? `<td><button onclick="dec('${id}')">-</button></td>`
         : ""
     }
     ${source === "task" ? `<td>${Math.round(count / nameFreqLen)}</td>` : ""}
    </tr>`;
  }

  let aproxCnt = Math.round(totalCnt / id);

  table += `
    </tbody>
    </table>
    <h2>Total: ${totalCnt}</h2>
    ${source === "name" ? `<h2>Aproxx: ${aproxCnt}</h2>` : ""}
    
  `;
  // show_data.innerHTML = table;
  return table;
}

// buttton working

function inc(name) {
  // console.log("name", name);
  // console.log("count", count);

  const cntShow = document.querySelector(`#${"a" + name}`);
  // obj.count += 1;
  cntShow.innerHTML = Number(cntShow.innerHTML) + 1;
}

function dec(name) {
  const cntShow = document.querySelector(`#${"a" + name}`);
  cntShow.innerHTML = Number(cntShow.innerHTML) - 1;
}

function shortName(name) {
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0];
  const first = parts[0];
  const second = parts[1].slice(0, 3);
  return `${first} ${second}...`;
}
