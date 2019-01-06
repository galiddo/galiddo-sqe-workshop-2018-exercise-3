import * as esprima from 'esprima';
import * as escodegen from 'escodegen';



let VARS = {};

let Dec = ['st=>start: start'];
let Flow = [];
let last = 'st';
let IfCount = 0;
let tmpCount=0;
let run = 1;
let runTmp;
let IV=[];
const parseCode = (codeToParse, inputV) => {

    Dec = ['st=>start: start'];
    Flow = [];
    last = 'st';
    IV = [];
    run = 1;
    IfCount = 0;
    tmpCount = 0;

    inputV.split(',').forEach(function (body) {
        IV.push(body);

    } );

    let e = esprima.parseScript(codeToParse,{loc:true});
    let ans = '';
    runExtractor(e);
    for (var i in Dec){
        ans+=Dec[i];
        ans+='\n';
    }

    for (var i1 in Dec){
        ans+=Flow[i1];
        ans+='\n';
    }

    return ans;
};



const getExtractor = (parsedCode) =>
{    let map = [];
    let func;
    map['Program'] = exProgram;
    map['FunctionDeclaration'] = exFunDec;
    map['BlockStatement'] = exProgram;
    //map['ForStatement'] = exFor;
    map['ExpressionStatement'] = exStat;
    //map['SequenceExpression'] = exSeq;
    map['AssignmentExpression'] = exAss;
    map['ReturnStatement'] = exRet;
    map['WhileStatement'] = exWhile;
    map['IfStatement'] = exIf;
    map['VariableDeclarator'] = exTor;//
    map['VariableDeclaration'] = exTion;

    func = map[parsedCode];
    return func;
};
const exStat = (parsed) =>
{
    return runExtractor(parsed.expression);
};
const replaceHandler = (Bin) =>
{
    if(!(Bin.type==='Identifier'||Bin.type==='Literal'))
    {
        if ((Bin.left.type === 'Identifier' || Bin.left.type === 'Literal') && VARS[Bin.left.name])
            Bin.left = VARS[Bin.left.name];
        else
            replaceHandler(Bin.left);

        if ((Bin.right.type === 'Identifier' || Bin.right.type === 'Literal') && VARS[Bin.right.name])
            Bin.right = VARS[Bin.right.name];
        else
            replaceHandler(Bin.right);
    }
};



const runExtractor = (parsedcode) =>{
    let e =  getExtractor(parsedcode.type);
    return e(parsedcode);
};
const exProgram = (parsedcode) => {
    let VAR1 = deepcopy(VARS);
    parsedcode.body.forEach(function (body) {
        runExtractor(body);
    });
    VARS=deepcopy(VAR1);


};

const exTor = (body) => {
    let n = body.id.name;
    Dec.push(n+'Dec'+ '=>'+'operation'+': '+n+' = '+Pars(body.init)+GetTemplate(0));
    Flow.push(last + '->' +body.id.name+'Dec');
    last = body.id.name+'Dec';

 /*   if((body.init.type==='Identifier'||body.init.type ==='Literal') &&VARS[body.id.name])
        body.init = VARS[body.init.name];
    else*/
        replaceHandler(body.init);

    VARS[body.id.name] = body.init;
};
const exTion = (declaration) => {

    declaration.declarations.forEach(function (body) {
        exTor(body);

    });


};


function GetTemplate (isBool) {
    let ans = '|';
    if(isBool)
    {
        ans+='Bool';
    }
    if(run)
    {
        ans+='Green';
    }
    if(ans==='|') {
        return '';
    }
    return ans;
}

const exFunDec = (parsedcode) => {

    last = parsedcode.id.name;

    // parsedcode.params.forEach(function (params) {
    //     VARS[params.name] = params.val;
    // });
    Dec.push(last+'=>'+'operation'+': '+parsedcode.id.name+GetTemplate(0));

    runExtractor(parsedcode.body);


};


/*const exFor = (parsedcode) => {


    runExtractor(parsedcode.init);
    runExtractor(parsedcode.update);
    runExtractor(parsedcode.body);

};*/

/*const exSeq = (parsedcode) => {
    let Data = [];
    parsedcode.expressions.forEach(function (exp) {
        Data = Data.concat(runExtractor(exp));

    });
    return Data;
};*/
let AssInt = 0;
const exAss = (parsedcode) => {
    AssInt++;
    let n = parsedcode.left.name;
    Dec.push(n+'Ass'+AssInt+ '=>'+'operation'+': '+n+' = ' +Pars(parsedcode.right)+GetTemplate(0));
    Flow.push(last + '->' +n+'Ass'+AssInt);
    last = n+'Ass'+AssInt;



    if((parsedcode.right.type==='Identifier'||parsedcode.right.type ==='Literal') &&VARS[parsedcode.right.name])
        parsedcode.right = VARS[parsedcode.right.name];
    else
        replaceHandler(parsedcode.right);

    VARS[parsedcode.left.name] = parsedcode.right;




};

let retCount = 0;
const exRet = (parsedcode) => {
    run = 1;
    Dec.push('ret'+retCount+'=>'+'operation'+': '+'return '+Pars(parsedcode.argument)+GetTemplate(0));
    Flow.push(last+'->'+'ret'+retCount);
    last = 'ret'+retCount;
    /*
    if((parsedcode.argument.type==='Identifier'||parsedcode.argument.type ==='Literal') &&VARS[parsedcode.argument.name])
        parsedcode.argument = VARS[parsedcode.argument.name];
    else
        replaceHandler(parsedcode.argument);
        */
};

let whileCount = 0;

let NULLCount = 0;
const exWhile = (parsedcode) => {
    let Ttmp = tmpCount++;
    let Twhile = whileCount++;
    let TNULL = NULLCount++;

    if((parsedcode.test.type==='Identifier'||parsedcode.test.type ==='Literal') &&VARS[parsedcode.test.name])
        parsedcode.test = VARS[parsedcode.test.name];
    else
        replaceHandler(parsedcode.test);



    let InputString = '';
    IV.forEach(function (body) {
        InputString+='let ';
        InputString+=body;
        InputString+=';';
    });
    let isx = eval(InputString+escodegen.generate(parsedcode.test));

    Dec.push('NULL'+TNULL+'=>'+'condition'+': '+Pars(parsedcode.test)+GetTemplate(0));
    Flow.push(last+'->'+'NULL'+TNULL);
    last = 'NULL'+TNULL;


    Dec.push('while'+Twhile+'=>'+'condition'+': '+Pars(parsedcode.test)+GetTemplate(isx));
    Flow.push(last+'->'+'while'+Twhile);

    /////yes
    last = 'while'+Twhile+'(yes)';
    runExtractor(parsedcode.body);

    Flow.push(last+'->'+'TNULL'+Twhile);
    last = 'while'+Twhile+'(no)';




};
const Pars = (toParse) => {return /*(toParse!=null)?*/escodegen.generate(toParse)/*:''*/;};
const deepcopy = (validJSON) => {
    return JSON.parse(JSON.stringify(validJSON));
};

const exIf = (parsedcode) => {
    let Ttmp = tmpCount++;
    let Tif = IfCount++;

    if((parsedcode.test.type==='Identifier'||parsedcode.test.type ==='Literal') &&VARS[parsedcode.test.name])
        parsedcode.test = VARS[parsedcode.test.name];
    else
        replaceHandler(parsedcode.test);

    let InputString = '';
    IV.forEach(function (body) {
        InputString+='let ';
        InputString+=body;
        InputString+=';';
    });
    let isx = eval(InputString+escodegen.generate(parsedcode.test));
    run = 0;
    if(isx) {run = 1;}
    //else { run=0;}
    Dec.push('if'+Tif+'=>'+'condition'+': '+Pars(parsedcode.test)+GetTemplate(1));
    Flow.push(last+'->'+'if'+Tif);

    last = 'if'+Tif+'(yes)';
    runExtractor(parsedcode.consequent);

    Dec.push('tmp'+Ttmp+'=>'+'operation'+': '+'tmp'+'|Green');
    Flow.push(last+'->'+'tmp'+Ttmp);


    last = 'if'+Tif+'(no)';
    if(parsedcode.alternate != null)
    {   run = 0;
        if(!isx) {run = 1;}
        runExtractor(parsedcode.alternate);
        Flow.push(last+'->'+'tmp'+Ttmp);
    }
    run=0;
    last = 'tmp'+Ttmp;


    // if((parsedcode.test.type==='Identifier'||parsedcode.test.type ==='Literal') &&VARS[parsedcode.test.name])
    //     parsedcode.test = VARS[parsedcode.test.name];
    // else
    //     replaceHandler(parsedcode.test);
    //
    // let InputString = '';
    // let InputString = '';
    // IV.forEach(function (body) {
    //     InputString+='let ';
    //     InputString+=body;
    //     InputString+=';';
    // });
    // let x = eval(InputString+escodegen.generate(parsedcode.test));
    // if(x) GreenLines.push(parsedcode.test.loc.start.line-1); else { RedLines.push(parsedcode.test.loc.start.line-1);};
    //
    // if(parsedcode.alternate == null) {}
    // else
    //     runExtractor(parsedcode.alternate);
    //

};

export {parseCode};








