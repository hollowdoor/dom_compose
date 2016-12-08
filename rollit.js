"use strict";
//import babel from 'rollup-plugin-babel';
const babel = require('rollup-plugin-babel');
const rollup = require('rollup');
const nodeResolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const writeFile = require('fs').writeFile;
const UglifyJS = require('uglify-js');
const pack = require('./package.json');
const external = Object.keys(pack.dependencies || {});

rollup.rollup({
    entry: 'src/index.js',
    plugins: [babel()],
    external: external
}).then((bundle)=>{
    bundle.write({
        dest: 'dist/bundle.js',
        format: 'cjs',
        moduleName: 'dom-compose',
        sourceMap: true
    });

    bundle.write({
        dest: 'dist/bundle.es.js',
        format: 'es',
        sourceMap: true
    });
    buildTest();
}).catch(onErrorCB('bundle'));



rollup.rollup({
    entry: 'src/index.js',
    plugins: [
        babel(),
        nodeResolve({
            jsnext: true,
            main: true
        }),
        commonjs()
    ],
}).then((bundle)=>{
    let b = bundle.write({
        dest: 'dist/dom-compose.js',
        format: 'iife',
        sourceMap: true,
        moduleName: 'domCompose'
    });

    b.then(what=>{

        try{
            var result = UglifyJS.minify('dist/dom-compose.js');
            //console.log('result ',result)
            writeFile('dist/dom-compose.min.js', result.code, onErrorCB('minify'));
        }catch(e){
            console.log('minify error ', e)
        }

    })
}).catch(onErrorCB('script sources'));

function buildTest(){
    rollup.rollup({
        entry: 'test/src.js',
        plugins: [
            nodeResolve({
                main: true,
                jsnext: true
            }),
            commonjs(),
            babel()

        ]
    }).then(bundle=>{
        //console.log('what')
        bundle.write({
            dest: 'test/code.js',
            format: 'iife',
            sourceMap: true,
            moduleName: 'none'
        });
    }).catch(onErrorCB('test code'));

}

function onErrorCB(message){
    return function(e){
        if(e){
            if(message)
                console.log(message);
            console.log(e);
            console.log(e.stack);
        }
    };
}
