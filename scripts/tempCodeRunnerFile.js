const horse = {
	name: "Topher",
	size: "large",
	skills: ["jousting, racing"],
	age: 7
};
function horseAge(str, age) {
	const ageStr = age > 5 ? "old" : "young";
	return `${str[0]}${ageStr} at ${age} years`;
}
const bio2 = horseAge`This horse is ${7}`;
console.log(bio2);
//         = "This horse is old at 7 years"