import $ from 'jquery';
import {parseCode} from './code-analyzer';

import * as escodegen from 'escodegen';
import * as flowchart from 'flowchart.js';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        document.getElementById('diagram').innerHTML = '';
        let codeToParse = $('#codePlaceholder').val();
        let inputVector = $('#inputV').val();
        let parsedCode = parseCode(codeToParse,inputVector);
        var diagram = flowchart.parse(parsedCode);
        diagram.drawSVG('diagram' ,{'x': 0,
            'y': 0,
            'line-width': 3,
            'line-length': 50,
            'text-margin': 10,
            'font-size': 14,
            'font-color': 'black',
            'line-color': 'black',
            'element-color': 'black',
            'fill': 'white',
            'yes-text': 'yes',
            'no-text': 'no',
            'arrow-end': 'block',
            'scale': 1,
            // style symbol types
            'symbols': {
                'start': {
                    'font-color': 'red',
                    'element-color': 'green',
                    'fill': 'yellow'
                },
                'end':{
                    'class': 'end-element'
                }
            },'flowstate' : {
                'Bool': {'yes-text': 'T', 'no-text': 'F'},
                'BoolGreen': {'yes-text': 'T', 'no-text': 'F','fill' : 'Green'},
                'Green': {'fill' : 'Green'}
            }});

    });
});
