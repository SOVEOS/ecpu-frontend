/*jshint esversion: 6 */

var nodeOption = document.getElementById('scatterHost').value;

ScatterJS.plugins( new ScatterEOS() );

let api;

var network = ScatterJS.Network.fromJson({
        blockchain: 'eos',
        chainId: '2a02a0053e5a8cf73a56ba0fda11e4d92e0238a4a2aa74fccf46d5a910746840',
        host: nodeOption,
        port: 443,
        protocol: 'https'
});

var rpc = new eosjs_jsonrpc.default(network.fullhost());

ScatterJS.connect('ecpu.app', {network}).then(connected => {
  if (!connected) return console.error('no scatter');
      api = ScatterJS.eos(network, eosjs_api.default, {rpc});
});
//document.getElementById('doinit').style.visibility = "hidden";
// Perpetually update the information being pulled from the chain to the application
const appThread = () => {
    const status = document.getElementById('status');
        if (!ScatterJS) return status.innerText = 'please login';
        if (!ScatterJS.identity) return status.innerText = 'please login',
                document.getElementById('loginButton').innerHTML = '<i class="fas fa-lg fa-key"></i>',
                document.getElementById('totalDelegating').innerHTML = "ecpu delegated",
                document.getElementById('liquidECPU').innerHTML = "ecpu liquid",
                document.getElementById('ecpuBalance').innerHTML = "ECPU",
                document.getElementById('eosBalance').innerHTML = "EOS",
                document.getElementById('deltable').innerHTML = "",
                document.getElementById('ecpuRecipient').value = "account name",
                document.getElementById('voteInfo').innerHTML = "",
                document.getElementById('undelAll').innerHTML = " ";

            status.innerText = ScatterJS.identity.accounts[0].name;
            const scatterAccount = ScatterJS.identity.accounts[0].name;
            document.getElementById('loginButton').innerHTML = '<i class="fas fa-lg fa-unlock"></i>';

                rpc.get_account(scatterAccount).then(function(value) {

                        let cpuMax = value.cpu_limit.max;
                        let cpuUsed = value.cpu_limit.used;
                        let cpuAval = value.cpu_limit.available;
                        let netMax = value.net_limit.max;
                        let netUsed = value.net_limit.used;
                        let netAval = value.net_limit.available;
                        let ramMax = value.ram_quota;
                        let ramUsed = value.ram_usage;
                        let ramAval = ramMax - ramUsed;


                        let cpuUsedPercent = (cpuUsed / cpuMax) * 100;
                            cpuUsedPercent = parseFloat(cpuUsedPercent.toFixed(2));
                        let cpuAvalPercent = (cpuAval / cpuMax) * 100;
                            cpuAvalPercent = parseFloat(cpuAvalPercent.toFixed(2));
                        let netUsedPercent = (netUsed / netMax) * 100;
                            netUsedPercent = parseFloat(netUsedPercent.toFixed(2));
                        let netAvalPercent = (netAval / netMax) * 100;
                            netAvalPercent = parseFloat(netAvalPercent.toFixed(2));


                                if (value == null)
                                    return;

    //doughnut
  var ctxD = document.getElementById("cpuChart").getContext('2d');
  var mycpuChart = new Chart(ctxD, {
    type: 'doughnut',
    data: {
      datasets: [{
        data: [cpuUsedPercent, cpuAvalPercent],
        backgroundColor: ["#F7464A", "#46BFBD"],
        borderColor: "#1C2331",
        borderWidth:"0"
      }]
    },
    options: {
      responsive: true,
      animation: false,
      maintainAspectRatio: false,
      tooltips: {enabled: false},
        hover: {mode: null}
    }
  });

      //doughnut
  var ctxD1 = document.getElementById("netChart").getContext('2d');
  var mynetChart = new Chart(ctxD1, {
    type: 'doughnut',
    data: {
      datasets: [{
        data: [netUsedPercent, netAvalPercent],
        backgroundColor: ["#F7464A", "#46BFBD"],
        borderColor: "#1C2331",
        borderWidth:"0"
      }]
    },
    options: {
      responsive: true,
      animation: false,
      maintainAspectRatio: false,
      tooltips: {enabled: false},
        hover: {mode: null}
    }
  });

      //doughnut
  var ctxD2 = document.getElementById("ramChart").getContext('2d');
  var myramChart = new Chart(ctxD2, {
    type: 'doughnut',
    data: {
      datasets: [{
        data: [ramUsed, ramAval],
        backgroundColor: ["#F7464A", "#46BFBD"],
        borderColor: "#1C2331",
        borderWidth:"0"
      }]
    },
    options: {
      responsive: true,
      animation: false,
      maintainAspectRatio: false,
      tooltips: {enabled: false},
        hover: {mode: null}
    }
  });

                            });

rpc.get_table_rows({
                            "json": "true",
                            "code": "ecpuvotereos",
                            "scope": scatterAccount,
                            "table": "voters"
                        }).then(function(value) {

                            let candidate = value.rows[0].proxy;
                            let voteAmount = value.rows[0].delegated;

                            if (value) {
                                document.getElementById('voteInfo').innerHTML = "<span class='bold text-light' style='font-size:14px;'>you are voting for <span class='text-info'>" + candidate + "</span></span><br><span class='bold text-light' style='font-size:14px;'>your vote weight is: <span class='text-info'>" + voteAmount + "</span></span>";

                            }


                    });

 rpc.get_table_rows({
                            "json": "true",
                            "code": "cpumintofeos",
                            "scope": scatterAccount,
                            "table": "accounts"
                        }).then(function(value) {
                            let ecpuBalance = parseFloat(value.rows[0].balance);
                            let delegating = parseFloat(value.rows[0].delegated);
                            let undelegating = parseFloat(value.rows[0].undelegating);
                            let totalECPUPower = value.rows[0].cpupower;
                            let liquid = parseFloat(ecpuBalance - delegating - undelegating.toFixed(8));

                            document.getElementById('totalDelegating').innerHTML = delegating + " ecpu delegated";
                            document.getElementById('liquidECPU').innerHTML = liquid + " ecpu liquid";
                            document.getElementById('ecpuBalance').innerHTML = ecpuBalance + " ECPU";

            });


rpc.get_table_rows({
                            "json": "true",
                            "code": "cpumintofeos",
                            "scope": "cpumintofeos",
                            "table": "accounts"
                        }).then(function(value) {
                            let ecpuMiningBalance = parseFloat(value.rows[0].balance);
                            let mining_rate = parseFloat(ecpuMiningBalance / 10000).toFixed(8);

                            document.getElementById('ecpuMiningRate').innerHTML = "<span class='bold' style='font-size:14px;'>mining reward: <span style='color:#00bb00'>" + mining_rate + "</span> ECPU</span>";


            });



rpc.get_table_rows({
                            "json": "true",
                            "code": "cpumintofeos",
                            "scope": scatterAccount,
                            "table": "delegates"
                        }).then(function(value) {
                                //console.log("Table stat: ");
                                //console.log(value);

                                let l = value.rows.length;
                                let liquid = document.getElementById('liquidECPU').innerHTML;
                                    liquid = parseFloat(liquid).toFixed(8);


                                let delRows = "";

                                for (let i = 0; i < l; i++) {

                                    let delInfo = [value.rows[i].recipient,value.rows[i].cpupower,value.rows[i].undelegatingecpu];

                                    let delAcct = value.rows[i].recipient;

                                    let undelDate = [value.rows[i].undelegatetime,parseFloat(value.rows[i].undelegatingecpu)];

                                    let undelegatingECPU = parseFloat(value.rows[i].undelegatingecpu) + " ECPU";
                                        if (countdownTimer(undelDate) == "n/a") {
                                            undelegatingECPU = "0 ECPU";
                                        }

                                    if (parseFloat(value.rows[i].cpupower) || parseFloat(value.rows[i].undelegatingecpu) > 0 || scatterAccount == value.rows[i].recipient) {
                                    delRows += "<tr class='text-white-50'><td><button id='"+delAcct+"' type='button' value='" + delAcct + "' class='btn btn-link fw-bold pl-0 pb-0 pt-0 m-0' onclick='showThisAccount(this.value);'>" + value.rows[i].recipient + "</button><p class='m-0 pb-0 pt-0 pl-0'>" + parseFloat(value.rows[i].cpupower) + " ECPU</p></td><td><p class='m-0 p-0'>" + countdownTimer(undelDate) + "</p><p class='m-0 p-0'>" + undelegatingECPU + "</p></td><td class='align-middle'>";
                                    if (parseFloat(value.rows[i].cpupower) > 0) {
                                        delRows += "<button id='cb"+i+"' type='button' value='" + i + "' class='btn sunny-morning-gradient text-dark waves-effect z-depth-3 btn-sm fw-bold m-0 pt-2 pb-2 pl-3 pr-3' onclick='autoUndelegateECPU(this.value);'><i class='fas fa-2x fa-plug'></i></button></td></tr>";
                                    }   else if (liquid == 0) {
                                        delRows += "<button type='button' value='" + i + "' class='btn mdb-color lighten-1 text-dark waves-effect z-depth-3 btn-sm fw-bold m-0 pt-2 pb-2 pl-3 pr-3' disabled><i class='fas fa-2x fa-ban'></i></button></td></tr>";
                                    }
                                    else {
                                        delRows += "<button id='cb"+i+"' type='button' value='" + i + "' class='btn aqua-gradient text-dark waves-effect z-depth-3 btn-sm fw-bold m-0 pt-2 pb-2 pl-3 pr-3' onclick='autoDelegateECPU(this.value);'><i class='fas fa-2x fa-charging-station'></i></button></td></tr>";
                                    }
                                }
                            }

                            document.getElementById('deltable').innerHTML = delRows;

                            let totalDelegated = document.getElementById('totalDelegating').innerHTML;
                                    totalDelegated = parseFloat(totalDelegated);


                             if (l>1 && totalDelegated>0) {
                                document.getElementById('undelAll').innerHTML = "<p class='row d-flex justify-content-center text-light my-0'>undelegate all</p><p class='justify-content-center d-flex'><button id='undelegateAll' class='btn btn-rounded border border-danger btn-lg waves-effect z-depth-4' onclick='undelAll(this.id);'><i class='fas fa-2x fa-plug text-danger'></i></button></p>";
                                }

                            else {document.getElementById('undelAll').innerHTML = " ";}

                            });



            rpc.get_table_rows({
                            "json": "true",
                            "code": "eosio.token",
                            "scope": scatterAccount,
                            "table": "accounts"
                        }).then(function(value) {

                            let eosBalance = parseFloat(value.rows[0].balance);


                            document.getElementById('eosBalance').innerHTML = eosBalance + " EOS";

            });
};

appThread();
setInterval(() => {
    appThread();
}, 1000);





function changeNode() {

  setTimeout(function() {
    nodeOption = document.getElementById('scatterHost').value;

    network = ScatterJS.Network.fromJson({
        blockchain: 'eos',
        chainId: '2a02a0053e5a8cf73a56ba0fda11e4d92e0238a4a2aa74fccf46d5a910746840',
        host: nodeOption,
        port: 443,
        protocol: 'https'

    });
    rpc = new eosjs_jsonrpc.default(network.fullhost());
    api = ScatterJS.eos(network, eosjs_api.default, {rpc});

    alert('You successfully changed the node to ' + nodeOption);



    appThread();
},200);
}




function help(){
  setTimeout(function() {
    if (confirm("Click OK to speak with the developers on Telegram.") == true)
        {window.open("https://t.me/eossov");}

    else {return false;}
},200);
}

function showThisAccount(val) {
  animateCSS("#"+val, "bounceIn");
    document.getElementById('ecpuRecipient').value = val;
}



function signInOut() {


    if (!ScatterJS.identity) {ScatterJS.login().then(id => {
                if (!id) return alert('no wallet connected');
                const account = ScatterJS.account('eos');
                document.getElementById('ecpuRecipient').value = account.name;
        });
    }

    else    {
                ScatterJS.logout();
            }

}


function autoDelegateECPU(i){
  animateCSS("#cb"+i, 'bounceIn');
            ScatterJS.login().then(id => {
                if (!id) return console.error('no identity');
                const account = ScatterJS.account('eos');
                rpc.get_table_rows({
                            "json": "true",
                            "code": "cpumintofeos",
                            "scope": account.name,
                            "table": "delegates"
                        }).then(function(value) {

                            let targetAccount = value.rows[i].recipient;
                            let liquidECPU = document.getElementById('liquidECPU').innerHTML;
                                liquidECPU = parseFloat(liquidECPU).toFixed(8);


                if (confirm("Delegate ECPU to " + targetAccount + "? Please note that delegating will not stop the undelegating process.") == true) {

                    let delegateAmount = prompt("You have " + liquidECPU + " liquid ECPU.  How many would you like to delegate to " + targetAccount + "?");
                        delegateAmount = format_ecpu_amount(delegateAmount);

                api.transact({
                    actions: [{
                        account: 'cpumintofeos',
                        name: 'delegate',
                        authorization: //user paying for resources must go first
                            [{

                            actor: account.name,
                            permission: account.authority,

                        }],
                        data: {
                            //todo:pass in data object
                            account: account.name,
                            receiver: targetAccount,
                            value: delegateAmount
                        }},
                    ]},

                 {blocksBehind: 3,
                  expireSeconds: 30
                }).then(res => {
                    console.log('sent tx: ', res);
                    alert('You successfully delegated ' + delegateAmount + ' to ' + targetAccount);
                }).catch(err => {
                    console.error('error thrown: ', err);
                    alert(err);
                });
            }
            else {return false;}

            });
        });
    }


    function autoUndelegateECPU(i){
      animateCSS("#cb"+i, 'bounceIn');
            ScatterJS.login().then(id => {
                if (!id) return console.error('no identity');
                const account = ScatterJS.account('eos');
                rpc.get_table_rows({
                            "json": "true",
                            "code": "cpumintofeos",
                            "scope": account.name,
                            "table": "delegates"
                        }).then(function(value) {

                            let targetAccount = value.rows[i].recipient;
                            let undelegateAmount = value.rows[i].cpupower;
                            let liquidECPU = document.getElementById('liquidECPU').innerHTML;
                                liquidECPU = parseFloat(liquidECPU).toFixed(8);


                if (confirm("Undelegate all " + undelegateAmount + " delegated to " + targetAccount + "?") == true) {

                api.transact({
                    actions: [{
                        account: 'cpumintofeos',
                        name: 'undelegate',
                        authorization: //user paying for resources must go first
                            [{

                            actor: account.name,
                            permission: account.authority,

                        }],
                        data: {
                            //todo:pass in data object
                            account: account.name,
                            receiver: targetAccount,
                            value: undelegateAmount
                        }},
                    ]},

                 {blocksBehind: 3,
                  expireSeconds: 30
                }).then(res => {
                    console.log('sent tx: ', res);
                    alert('You successfully undelegated all ECPU from ' + targetAccount);
                }).catch(err => {
                    console.error('error thrown: ', err);
                    alert(err);
                });
            }
            else {return false;}

            });
        });
    }






function delegateECPU(){
            ScatterJS.login().then(id => {
                if (!id) return console.error('no identity');
                const account = ScatterJS.account('eos');



                    let targetAccount = document.getElementById('ecpuRecipient').value;
                    let delegateAmount = format_ecpu_amount(document.getElementById('ecpuAmount').value);

                    if (confirm("Delegate " + delegateAmount + " to " + targetAccount + "?") == true) {

                api.transact({
                    actions: [{
                        account: 'cpumintofeos',
                        name: 'delegate',
                        authorization: //user paying for resources must go first
                            [{

                            actor: account.name,
                            permission: account.authority,

                        }],
                        data: {
                            //todo:pass in data object
                            account: account.name,
                            receiver: targetAccount,
                            value: delegateAmount
                        }},
                    ]},

                 {blocksBehind: 3,
                  expireSeconds: 30
                }).then(res => {
                    console.log('sent tx: ', res);
                    alert('You successfully delegated ' + delegateAmount + ' to ' + targetAccount);
                }).catch(err => {
                    console.error('error thrown: ', err);
                    alert(err);
                });
            }
            else {return false;}
        });
    }


    function undelegateECPU(){
            ScatterJS.login().then(id => {
                if (!id) return console.error('no identity');
                const account = ScatterJS.account('eos');



                    let targetAccount = document.getElementById('ecpuRecipient').value;
                    let undelegateAmount = format_ecpu_amount(document.getElementById('ecpuAmount').value);

                    if (confirm("Undelegate " + undelegateAmount + " from " + targetAccount + "?") == true) {

                api.transact({
                    actions: [{
                        account: 'cpumintofeos',
                        name: 'undelegate',
                        authorization: //user paying for resources must go first
                            [{

                            actor: account.name,
                            permission: account.authority,

                        }],
                        data: {
                            //todo:pass in data object
                            account: account.name,
                            receiver: targetAccount,
                            value: undelegateAmount
                        }},
                    ]},

                 {blocksBehind: 3,
                  expireSeconds: 30
                }).then(res => {
                    console.log('sent tx: ', res);
                    alert('You successfully undelegated ' + undelegateAmount + ' from ' + targetAccount);
                }).catch(err => {
                    console.error('error thrown: ', err);
                    alert(err);
                });
            }
            else {return false;}
        });
    }








        function activateECPU(){
            ScatterJS.login().then(id => {
                if (!id) return console.error('no identity');
                const account = ScatterJS.account('eos');

                if (confirm("Activate account in ECPU contract?") == true) {

                api.transact({
                    actions: [{
                        account: 'cpumintofeos',
                        name: 'open',
                        authorization: //user paying for resources must go first
                            [{

                            actor: account.name,
                            permission: account.authority,

                        }],
                        data: {
                            //todo:pass in data object
                            owner: account.name,
                            symbol: '8,ECPU',
                            ram_payer: account.name
                        }},
                    ]},

                 {blocksBehind: 3,
                  expireSeconds: 30
                }).then(res => {
                    console.log('sent tx: ', res);
                    alert('You successfully activated your account in the ECPU contract');
                }).catch(err => {
                    console.error('error thrown: ', err);
                    alert(err);
                });
            }
            else {return false;}
        });
    }



function format_ecpu_amount(amount) {
    amount2 = parseFloat(amount).toFixed(8);
        return (amount2 + " ECPU");
    }



function countdownTimer(UNIX_timestamp) {

  const difference = (UNIX_timestamp[0] * 1000 + 86400000) - new Date().getTime();
  let remaining = "n/a";
  if (difference > 0) {
        let hours = Math.floor((difference/(1000*60*60))%24);
        let minutes = Math.floor((difference/1000/60)%60);
        let seconds = Math.floor((difference/1000)%60);
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        remaining = hours + "h " + minutes + "m " + seconds + "s ";

  }

  return remaining;

}



function timeConverter(UNIX_timestamp) {
        var a = new Date(UNIX_timestamp * 1000);
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
        var hour = a.getHours();
        var min = a.getMinutes();
        var sec = a.getSeconds();
        var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
        return time;
}



function consoleLog(val) {

    console.log(val);
}


function undelAll(element) {
  animateCSS("#"+element, "bounceIn");

    ScatterJS.login().then(id => {
                if (!id) return console.error('no identity');
                const account = ScatterJS.account('eos');

    if (confirm("Undelegate all delegated ECPU from all accounts including your own?") == true) {

                        rpc.get_table_rows({
                            "json": "true",
                            "code": "cpumintofeos",
                            "scope": account.name,
                            "table": "delegates"
                        }).then(function(value) {


                        console.log("============================");

                        //var actions = [ action, action ];
                        let l = value.rows.length;
                        let theactions = [];
                        let action;

                        for (let i = 0; i < l; i++) {
                            if (parseFloat(value.rows[i].cpupower) > 0) {

                        action = {

                            account: 'cpumintofeos',
                            name: 'undelegate',
                            authorization:
                                [{
                                actor: account.name,
                                permission: account.authority,
                            }],
                        data: {
                            account: account.name,
                            receiver: value.rows[i].recipient,
                            value: value.rows[i].cpupower
                            }
                        };

                            theactions.push(action);
                        }}
                        console.log(theactions);


                        api.transact({
                    actions: theactions},

                 {blocksBehind: 3,
                  expireSeconds: 30
                }).then(res => {
                    console.log('sent tx: ', res);
                    alert('You successfully undelegated from all accounts');
                }).catch(err => {
                    console.error('error thrown: ', err);
                    alert(err);
                });
                        return (0);

        });}});}


const animateCSS = (element, animation, prefix = 'animate__') =>

  new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;
    const node = document.querySelector(element);

    node.classList.add(`${prefix}animated`, animationName);


    function handleAnimationEnd(event) {
      event.stopPropagation();
      node.classList.remove(`${prefix}animated`, animationName);
      resolve('Animation ended');
    }

    node.addEventListener('animationend', handleAnimationEnd, {once: true});
  });




  function dotransaction_bundle() {
    ScatterJS.login().then(id => {
                if (!id) return console.error('no identity');
                const account = ScatterJS.account('eos');

                        rpc.get_table_rows({
                            "json": "true",
                            "code": "cpumintofeos",
                            "scope": "cpumintofeos",
                            "table": "accounts"
                        }).then(function(value) {
                                //console.log("Table stat: ");
                                //console.log(value);

                               let ecpu_mining_supply = parseFloat(value.rows[0].balance);




                        let targetMiningRate = parseFloat(document.getElementById('target_mining_rate').value);


                        let miningRate1 = parseFloat(ecpu_mining_supply / 10000);


                        let myRange = document.getElementById('myRange').value;
                        //alert("myRange: " + myRange);

                        let action = {

                            account: 'eosio.token',
                            name: 'transfer',
                            authorization: [{
                                actor: account.name,
                                permission: account.authority
                            }],
                            data: {
                                "from": account.name,
                                "to": "cpumintofeos",
                                "quantity": "0.0010 EOS",
                                "memo": ""
                            }
                        };

                        if (miningRate1 > targetMiningRate) {


                        console.log("============================");
                        console.log(action);

                        //var actions = [ action, action ];
                        let theactions = [];
                        for (let i = 0; i < myRange; i++) {
                            theactions[i] = action;
                        }
                        console.log(theactions);


                        api.transact({
                    actions: theactions},

                 {blocksBehind: 3,
                  expireSeconds: 30
                }).then(res => {
                    animateCSS('#eosBalance', 'flash'), animateCSS('#pickaxe_png', 'rotateInUpLeft'), animateCSS('#ecpuBalance', 'bounceIn'), update_ticker();

                }).catch(err => {
                    console.error('error thrown: ', err);
                    alert(err);
                });
                        return (0);

                    }});});} // function dotransaction_bundle()

    function showVal(val) {


                        document.getElementById('dotransaction_bundle').innerHTML = "<img src='https://img.icons8.com/external-jumpicon-glyph-ayub-irawan/32/000000/external-mining-cryptocurrency-jumpicon-glyph-jumpicon-glyph-ayub-irawan-2.png'/> X " + val;

                    }



let autominer_cnt = 0;
let automining = 0;

                    function switch_autominer(val) {


                        // alert(val.checked);

                        if (val.checked) automining = 1;
                        else automining = 0;

                        //alert("automining:" + automining);

                    } // switch_autominer

                    function update_ticker() {
                        autominer_cnt++;

                        if (autominer_cnt == 11) autominer_cnt = 1;
                        // let randoColor = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
                        let colors = ["#ff4444", "#ffbb33", "#00C851", "#33b5e5", "#33b5e5", "#2BBBAD", "#4285F4", "#aa66cc", "#d0d6e2"];
                        let randomColor = colors[Math.floor(Math.random()*colors.length)];
                        //---
                        for (let i = 1; i <= 10; i++) {
                            let therect = 'rect' + i;
                            let f2 = document.getElementById(therect);
                            f2.setAttribute('fill', "#2e3951");

                        }

                        let therect = 'rect' + autominer_cnt;
                        let f3 = document.getElementById(therect);
                        f3.setAttribute('fill', randomColor);
                        //---

                    } // update_ticker

                    function auto_mine_thread() {

                        if (automining > 0) {

                            dotransaction_bundle();
                        }

                        time = setTimeout('auto_mine_thread()', 3500);
                    }

auto_mine_thread();


                    function vote_chart_thread() {



 rpc.get_table_rows({
                            "json": "true",
                            "code": "ecpuvotereos",
                            "scope": "ecpuvotereos",
                            "table": "proxies"
                        }).then(function(value) {

                            let l = value.rows.length;
                            let proxies = [];
                            let votes = [];
                            let votesNproxies = [];



                            for (let i = 0; i < l; i++) {
                                proxies.push(value.rows[i].proxy);
                                let vote = parseFloat(value.rows[i].delegated);
                                votes.push(vote);
                                votesNproxies.push({id: proxies[i], votes: votes[i]});

                            }



  var ctxP = document.getElementById("voteChart").getContext('2d');
  var myvoteChart = new Chart(ctxP, {
    type: 'pie',
    data: {
      labels: proxies,
      datasets: [{
        data: votes,
        backgroundColor: ["#33b5e5", "#2BBBAD", "#4285F4", "#aa66cc", "#d0d6e2"]
      }]
    },
    options: {
      responsive: true,
      animation: false


    }
  });

  });

                        time = setTimeout('vote_chart_thread()', 5000);

                    }

vote_chart_thread();


function vote(){
  animateCSS('#voteBtn', 'bounceIn');
            ScatterJS.login().then(id => {
                if (!id) return console.error('no identity');
                const account = ScatterJS.account('eos');

                let candidate = document.getElementById('voteRecipient').value;

                if (confirm("Vote for " + candidate + "?") == true) {

                api.transact({
                    actions: [{
                        account: 'ecpuvotereos',
                        name: 'vote',
                        authorization: //user paying for resources must go first
                            [{

                            actor: account.name,
                            permission: account.authority,

                        }],
                        data: {
                            //todo:pass in data object
                            user: account.name,
                            proxy: candidate,
                        }},
                    ]},

                 {blocksBehind: 3,
                  expireSeconds: 30
                }).then(res => {
                    console.log('sent tx: ', res);
                    alert('You successfully voted for' + candidate);
                }).catch(err => {
                    console.error('error thrown: ', err);
                    alert(err);
                });
            }
            else {return false;}
        });
    }


 $("button").click(function() {
      animateCSS("#" + this.id, "bounceIn");
    })
