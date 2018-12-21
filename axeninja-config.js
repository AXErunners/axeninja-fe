/*
 This file is part of AXE Ninja.
 https://github.com/axerunners/axeninja-fe

 AXE Ninja is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 AXE Ninja is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with AXE Ninja.  If not, see <http://www.gnu.org/licenses/>.

 */

// Either indicate if we are we on testnet (=1) or on mainnet (=0)
//var axeninjatestnet = 0;
// OR indicate the hostname for testnet (if the hostname the page is running is equal to this, it will switch to testnet)
var axeninjatestnethost = 'test.axeninja.pl';
var axeninjatestnetexplorer = 'test.explorer.axeninja.pl';

// Tor onion hostname
var axeninjator = 'seuhd5sihasshuqh.onion';
var axeninjatestnettor = 'gycv32vrbvhfohjj.onion';
var axeninjai2p = 'dzjzoefy7fx57h5xkdknikvfv3ckbxu2bx5wryn6taud343g2jma.b32.i2p';
var axeninjatestneti2p = 'hkttp5yfsmmmtsgynadotlk6t3ppsuaj274jzipj4fe7cko3whza.b32.i2p';

// Coin logos
var axeninjacoin = ['AXE','tAXE'];

// URLs
// Block info
// ["https://explorer.axeninja.pl/block/%%b%%","elberethzone's Axe Blockchain Explorer"]
var axeninjablockexplorer = [[["http://chainz.cryptoid.info/axe/block.dws?%%b%%.htm","cryptoID Axe Blockchain Explorer"]],
                          [["https://test.explorer.axeninja.pl/block/%%b%%","AXE Ninja Testnet Blockchain Explorer"],
                           ["https://test.insight.axe.siampm.com/block/%%b%%","Alternate Testnet Axe Blockchain Explorer"]]];

// Address info
var axeninjamndetail = [[["/mndetails.html?mnpubkey=%%a%%","AXE Ninja Masternode Detail"],
                          ["https://www.axecentral.org/masternodes/%%a%%","Axe Central Masternode Monitoring"]],
                         [["/mndetails.html?mnpubkey=%%a%%","AXE Ninja Testnet Masternode Detail"]]];
var axeninjamndetailvin = [[["/mndetails.html?mnoutput=%%a%%","AXE Ninja Masternode Detail"]],
                            [["/mndetails.html?mnoutput=%%a%%","AXE Ninja Testnet Masternode Detail"]]];

// ["https://explorer.axeninja.pl/address/%%a%%","elberethzone's Axe Blockchain Explorer"],
var axeninjaaddressexplorer = [[["https://chainz.cryptoid.info/axe/address.dws?%%a%%.htm","cryptoID Axe Blockchain Explorer"]],
                                [["https://test.explorer.axeninja.pl/address/%%a%%","AXE Ninja Testnet Blockchain Explorer"],
                                 ["https://test.insight.axe.siampm.com/address/%%a%%","Alternate Testnet Axe Blockchain Explorer"]]];
// ["http://explorer.axeninja.pl/tx/%%a%%","elberethzone's Axe Blockchain Explorer"],
var axeninjatxexplorer = [[["https://chainz.cryptoid.info/axe/tx.dws?%%a%%.htm","cryptoID Axe Blockchain Explorer"]],
                           [["http://test.explorer.axeninja.pl/tx/%%a%%","AXE Ninja Testnet Blockchain Explorer"],
                            ["https://test.insight.axe.siampm.com/tx/%%a%%","Alternate Testnet Axe Blockchain Explorer"]]];

// Search query
// ["https://explorer.axeninja.pl/search?q=%%q%%","elberethzone's Axe Blockchain Explorer"],
var axeninjaqueryexplorer = [[["https://chainz.cryptoid.info/axe/search.dws?q=%%q%%","cryptoID Axe Blockchain Explorer"]],
                            [["https://test.explorer.axeninja.pl/search?q=%%q%%","AXE Ninja Testnet Blockchain Explorer"],
                             ["http://test.explorer.darkcoin.qa/search?q=%%q%%","Official Testnet Axe Blockchain Explorer"]]];

var axeninjamasternodemonitoring = ["/masternodes.html?mnregexp=%%p%%#mnversions","/masternodes.html?mnregexp=%%p%%#mnversions"];

var axeninjabudgetdetail = ["/budgetdetails.html?budgetid=%%b%%","/budgetdetails.html?budgetid=%%b%%"];

var axeninjagovernanceproposaldetail = ["/proposaldetails.html?proposalhash=%%b%%","/proposaldetails.html?proposalhash=%%b%%"];

// Blocks per day
var axeblocksperday = 553;