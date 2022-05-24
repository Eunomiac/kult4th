
export default class kult4eActor extends Actor {

  async woundEffect(){
    var i;
    let modifier = 0;
    for (i=1; i<5; i++){
            if ( getProperty(this.data.data.attributes, `woundtext.majorwound${i}`) && (getProperty(this.data.data.attributes, `woundstabilized.majorwound${i}`) == "false")){
        
          modifier = 1
      }

    }
      return modifier;
  }  

  
    async moveroll(movename){
    const actordata = this.data;
    console.log(actordata)
    let moves = actordata.items.filter(function(item) {return item.name == movename} );
    console.log(moves);
    const type = "active";
    const item = moves[0];
    console.log(item);
    const movetype = moves[0].data.data.type;
    console.log(movetype);
    if (movetype == "passive")
    {alert("This ability is Passive");}
    else{
    const attr = moves[0].data.data.attributemod;
    const successtext = moves[0].data.data.completesuccess;
    const failuretext = moves[0].data.data.failure;
    const partialsuccess = moves[0].data.data.partialsuccess;
    const specialflag = moves[0].data.data.specialflag;
    let mod = 0;
    let harm = 0;
    if (movename == "Endure Injury"){
      let boxoutput = await new Promise(resolve => {
        new Dialog({
        title: "Endure Harm",
        content: '<label>How much Harm did you suffer?</label><input id="harm_value" data-type="number"',
        default: 'one',
        buttons:{
              one: {label: "Ok",
                callback: () => {
                      resolve({
                        "harm_value": document.getElementById("harm_value").value

                      })
                }
             }
            }
    
      }).render(true);
      })
      harm = boxoutput.harm_value;
    }
    console.log(attr)
    if(attr != '') {
        mod = this.data.data.attributes[attr];
    }
    
    let stab = this.data.data.stability.value;
    let situation = parseInt(this.data.data.sitmod) + parseInt(this.data.data.forward);
    console.log(`Sitmod is ` + this.data.data.sitmod);
    let woundmod = await this.woundEffect();
    situation -= woundmod;
    if (this.data.data.attributes.criticalwound && this.data.data.attributes.criticalwoundstabilized != "true")
    { situation -= 1;}
    if (specialflag == 1 && stab > 2)
      {situation -= 1};
    if (movetype == "disadvantage" && stab > 0)
      {situation -= 1};
    if (movetype == "disadvantage" && stab > 2)
      {situation -= 1};
    if (specialflag == 1 && stab > 5)
      {situation -= 1};
    if (movetype == "disadvantage" && stab > 5)
      {situation -=1};
    if (specialflag == 2 && stab > 5)
      {situation += 1}; 
   
    console.log(mod);
    console.log(situation);
    console.log(harm);
    let r = new Roll(`2d10 + ${mod} + ${situation} - ${harm}`);
    r.roll()
    if(r.total){
      console.log("Roll Successful")
      const updated = this.update({"data.sitmod": 0});
      console.log(`Sitmod is ` + this.data.data.sitmod);
     
    }
    if (r.total >= 15)
    {ChatMessage.create({ content: "<div class='move-name'>" + movename + "</div> <div class = 'move-name'> Success! </div> <div class = 'move-result'>" + successtext + "</div> <div class = 'result-roll'> <div class='tooltip'>"  + r.total + "<span class='tooltiptext'> " + r.result + "</span></div></div>", speaker: ChatMessage.getSpeaker({alias: this.name})});
    }
    else if (r.total < 10)
    {ChatMessage.create({ content: "<div class='move-name'>" + movename + "</div> <div class = 'move-name'> Failure! </div> <div class = 'move-result'>" + failuretext + "</div> <div class = 'result-roll'> <div class='tooltip'>"  + r.total + "<span class='tooltiptext'> " + r.result + "</span></div></div>", speaker: ChatMessage.getSpeaker({alias: this.name})});
    }
    else
    {ChatMessage.create({ content: "<div class='move-name'>" + movename + "</div> <div class = 'move-name'> Partial Success! </div> <div class = 'move-result'>" + partialsuccess + "</div> <div class = 'result-roll'> <div class='tooltip'>"  + r.total + "<span class='tooltiptext'> " + r.result + "</span></div></div>", speaker: ChatMessage.getSpeaker({alias: this.name})});
    }}
        
      
  }
  

}
