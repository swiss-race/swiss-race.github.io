import * as d3 from 'd3'
import * as L from 'leaflet'



/* let calculateMonthlyPayment = (principal, years, rate) => { */
//     let monthlyRate=0;
//     if (rate) {
//         monthlyRate = rate / 100 / 12;
//     }
//     let monthlyPayment = principal * monthlyRate / (1 - (Math.pow(1 / (1 + monthlyRate), years * 12)));
//     return {principal,years,rate,monthlyPayment,monthlyRate};
// };
//
// let calculateAmmortization = (principal,years,rate) => {
//     let {monthlyRate,monthlyPayment}=calculateMonthlyPayment(principal,years,rate)
//     let balance=principal
//     let ammortization=[]
//
//     for (let y=0; y<years; y++) {
//         let interestY=0
//         let principalY=0
//
//         for (let m=0; m<12; m++) {
//             let interestM=balance*monthlyRate
//             let principalM=monthlyPayment - interestM
//
//             interestY=interestY+interestM
//             principalY=principalY+principalM
//
//             balance=balance-principalM
//         }
//         ammortization.push({principalY,interestY,balance})
//     }
//     return {monthlyPayment,monthlyRate,ammortization}
//
/* } */

d3.selectAll("div")
    .style('color','red')

// d3.select('#map').append(map)

// document.getElementById('calcBtn').addEventListener('click', () => {
//     let principal = document.getElementById("principal").value;
//     let years = document.getElementById("years").value;
//     let rate = document.getElementById("rate").value;
//     let {monthlyRate,monthlyPayment,ammortization} = calculateAmmortization(principal, years, rate);
//     // console.log(monthlyRate);
//     document.getElementById("monthlyPayment").innerHTML = monthlyPayment.toFixed(2);
//     document.getElementById("monthlyRate").innerHTML = (monthlyRate * 100).toFixed(2);
//     ammortization.forEach(month => console.log(month))
//
// });
