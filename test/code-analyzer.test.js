import assert from 'assert';
import {parseCode} from '../src/js/code-analyzer';

describe('The javascript parser', () => {
    it('t1', () => {
        let e = parseCode('function foo(x, y, z){} ','x=1,y=2,z=3');
        assert.equal(
            e,
            'st=>start: start\nfoo=>operation: foo|Green\nundefined\nundefined\n'
        );
    });

    it('t2', () => {
        let e = parseCode('function foo(x, y, z){let a = 1;let b=a; let c=b+1;c=c+1;} ','x=1,y=2,z=3');
        assert.equal(
            e,
            'st=>start: start\nfoo=>operation: foo|Green\naDec=>operation: a = 1|Green\nbDec=>operation: b = a|Green\ncDec=>operation: c = b + 1|Green\ncAss1=>operation: c = c + 1|Green\nfoo->aDec\naDec->bDe' +
            'c\nbDec->cDec\ncDec->cAss1\nundefined\nundefined\n'
        );
    });
    it('t3', () => {
        let e = parseCode('function foo(x, y, z){let a = 1;let b=a; let c=b+1;c=c;} ','x=1,y=2,z=3');
        assert.equal(
            e,
            'st=>start: start\nfoo=>operation: foo|Green\naDec=>operation: a = 1|Green\nbDec=>operation: b = a|Green\ncDec=>operation: c = b + 1|Green\ncAss2=>operation: c = c|Green\nfoo->aDec\naDec->bDec\nb'+
        'Dec->cDec\ncDec->cAss2\nundefined\nundefined\n'
        );
    });
    it('t4', () => {
        let e = parseCode('function foo(x, y, z){let a = 1;let b=a; let c=b+1;c=c;return c;} ','x=1,y=2,z=3');
        assert.equal(
            e,
            'st=>start: start\nfoo=>operation: foo|Green\naDec=>operation: a = 1|Green\nbDec=>operation: b = a|Green\ncDec=>operation: c = b + 1|Green\ncAss3=>operation: c = c|Green\nret0=>operation: return '
        +'c|Green\nfoo->aDec\naDec->bDec\nbDec->cDec\ncDec->cAss3\ncAss3->ret0\nundefined\nundefined\n'
        );
    });
    it('t5', () => {
        let e = parseCode('function foo(x, y, z){let a = 1;let b=a; let c=b+1;c=c;return c+1;} ','x=1,y=2,z=3');
        assert.equal(
            e,
            'st=>start: start\nfoo=>operation: foo|Green\naDec=>operation: a = 1|Green\nbDec=>operation: b = a|Green\ncDec=>operation: c = b + 1|Green\ncAss4=>operation: c = c|Green\nret0=>operation: return '
        +'c + 1|Green\nfoo->aDec\naDec->bDec\nbDec->cDec\ncDec->cAss4\ncAss4->ret0\nundefined\nundefined\n'
        );
    });
    it('t6', () => {
        let e = parseCode('function foo(x, y, z){let a = 1;let b=a; let c=1+b;c=c;return 1+1+c;} ','x=1,y=2,z=3');
        assert.equal(
            e,
            'st=>start: start\nfoo=>operation: foo|Green\naDec=>operation: a = 1|Green\nbDec=>operation: b = a|Green\ncDec=>operation: c = 1 + b|Green\ncAss5=>operation: c = c|Green\nret0=>operation: return'+
        ' 1 + 1 + c|Green\nfoo->aDec\naDec->bDec\nbDec->cDec\ncDec->cAss5\ncAss5->ret0\nundefined\nundefined\n'
        );
    });
    it('t7', () => {
        let e = parseCode('function foo(x, y, z){let a = x + 1;let b = a + y;let c = 0;if (b < z) {c = c + 5;} else if (b < z * 2) {c = c + x + 5;} else {c = c + z + 5;}return c;}','x=1,y=2,z=3');
        assert.equal(
            e,

            'st=>start: start\nfoo=>operation: foo|Green\naDec=>operation: a = x + 1|Green\nbDec=>operation: b = a + y|Green\ncDec=>operation: c = 0|Green\nif0=>condition: x + 1 + y < z\ncAss6=>operation: c'
 +           ' = c + 5\ntmp0=>operation: tmp|Green\nif1=>condition: x + 1 + y < z * 2|BoolGreen\ncAss7=>operation: c = c + x + 5|Green\ntmp1=>operation: tmp|Green\ncAss8=>operation: c = c + z + 5\nret0=>operation: return c|Green'
+'\nfoo->aDec\naDec->bDec\nbDec->cDec\ncDec->if0\nif0(yes)->cAss6\ncAss6->tmp0\nif0(no)->if1\nif1(yes)->cAss7\ncAss7->tmp1\nif1(no)->cAss8\ncAss8->tmp1\ntmp1->tmp0\ntmp0->ret0\n'
        );
    });
    it('t8', () => {
        let e = parseCode('function foo(x, y, z){let a = x + 1;let b = a + y;let c = 0;if (b) {c = c + 5;} else if (b < z * 2) {c = c + x + 5;} else {c = c + z + 5;}return c;}','x=1,y=2,z=3');
        assert.equal(
            e,
            'st=>start: start\nfoo=>operation: foo|Green\naDec=>operation: a = x + 1|Green\nbDec=>operation: b = a + y|Green\ncDec=>operation: c = 0|Green\nif0=>condition: x + 1 + y|BoolGreen\ncAss9=>operati'+
        'on: c = c + 5|Green\ntmp0=>operation: tmp|Green\nif1=>condition: x + 1 + y < z * 2|BoolGreen\ncAss10=>operation: c = c + x + 5|Green\ntmp1=>operation: tmp|Green\ncAss11=>operation: c = c + z + 5\nret0=>operation: '+
        'return c|Green\nfoo->aDec\naDec->bDec\nbDec->cDec\ncDec->if0\nif0(yes)->cAss9\ncAss9->tmp0\nif0(no)->if1\nif1(yes)->cAss10\ncAss10->tmp1\nif1(no)->cAss11\ncAss11->tmp1\ntmp1->tmp0\ntmp0->ret0\n'
        );
    });

    it('t9', () => {
        let e = parseCode('function foo(x, y, z){let a = x + 1;let b = 3;let c = b;if (b) {c = c + 5;} return c;}','x=1,y=2,z=3');
        assert.equal(
            e,
            'st=>start: start\nfoo=>operation: foo|Green\naDec=>operation: a = x + 1|Green\nbDec=>operation: b = 3|Green\ncDec=>operation: c = b|Green\nif0=>condition: 3|BoolGreen\ncAss12=>operation: c = c +'+

            ' 5|Green\ntmp0=>operation: tmp|Green\nret0=>operation: return c|Green\nfoo->aDec\naDec->bDec\nbDec->cDec\ncDec->if0\nif0(yes)->cAss12\ncAss12->tmp0\ntmp0->ret0\nundefined\nundefined\n'
        );
    })
    it('t10', () => {
        let e = parseCode('function foo(x, y, z){let a = x + 1;let b = 3;let c = b;if (b) {c = c + 5;} return c+1;}','x=1,y=2,z=3');
        assert.equal(
            e,
            'st=>start: start\nfoo=>operation: foo|Green\naDec=>operation: a = x + 1|Green\nbDec=>operation: b = 3|Green\ncDec=>operation: c = b|Green\nif0=>condition: 3|BoolGreen\ncAss13=>operation: c = c +'+
            ' 5|Green\ntmp0=>operation: tmp|Green\nret0=>operation: return c + 1|Green\nfoo->aDec\naDec->bDec\nbDec->cDec\ncDec->if0\nif0(yes)->cAss13\ncAss13->tmp0\ntmp0->ret0\nundefined\nundefined\n'
        );
    });


});
