
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

const env = require('phoenix-api-lib').loadEnv(path.join(__dirname, '..', '..'));

String.prototype.stripIndent = function stripIndent(tabSize, initialTabs) {
    return this.replace(/(\n)(\s*)/g, (full, pre, x) => {
        return pre + x.slice(0, Math.max(x.length - tabSize * initialTabs, 0))
    });
};

String.prototype.capitalize = function () {
    return this[0].toUpperCase() + this.slice(1).toLowerCase();
};

const formats = {
    resource: (clsname, tableName, dbFile) => (
        `
        import Resource from '../../lib/http/resource'
        import { ${tableName} as Table } from '${dbFile}'
        import { arrWithout } from '../../lib/utils/helpers'
    
        export default class ${clsname} extends Resource {
            get table() { return Table }
            get fields(): Array<keyof typeof Table.fields> {
                return arrWithout(Object.keys(Table.fields), [
                    // Add blacklisted columns here
                ])
            }
        }
        `.stripIndent(4, 2)
    ),
    controller: (clsname, rscname, rscfile) => (
        `
        import { simpleDbRoute, SimpleController } from '../../lib/http/controller'
        import ${rscname} from '${rscfile}'
    
        class ${clsname} extends SimpleController<${rscname}> {  }
    
        export default new ${clsname}(${rscname})
        `.stripIndent(4, 2)
    )
};

const modes = {
    controller: function controller([name], options) {
        const rscfile = `../resources/${options.rscfile || name}`;

        const format = formats.controller(name.capitalize(), options.rsc || `${name.capitalize()}Rsc`, rscfile);

        createFile(format, 'controllers', options.file || name, options);
    },
    resource: function resource([name], options) {
        const table = options.table || name;
        const dbFile = `../../database/${options.db}`;

        const format = formats.resource(name.capitalize(), table, dbFile);

        createFile(format, 'resources', options.file || name, options);
    },
    token: function sign([id], options) {
        const signed = jwt.sign({id: id}, process.env.JWT_KEY, options);
        console.log('\x1b[32mToken created:' + '\x1b[35m ' + signed + '\x1b[0m');
    }

};

function modulePath(options) {
    return path.join(process.cwd(), 'src', options.module || 'arma')
}

function createFile(data, p, file, options) {
    if (!file) throw new Error('Missing `file` option')

    return fs.writeFileSync(path.join(modulePath(options), p, `${file}.ts`), data)
}

function make([args, options, flags]) {
    modes[args[0]](args.slice(1), options, flags)
}

function cliParse(sysArgs) {
    sysArgs = sysArgs[Symbol.iterator]();
    const allFlags = [];

    const args = [];
    const options = {};
    const flags = [];

    for (const k of sysArgs) {
        if (k.startsWith('-')) {
            const stripped = k.replace(/^-*/, '').toLowerCase();

            if (allFlags.indexOf(stripped) > -1) {
                flags.push(stripped);
            }
            else {
                options[stripped] = sysArgs.next().value;
            }
        }
        else {
            args.push(k.toLowerCase());
        }
    };

    return [args, options, flags];
};

if (require.main === module) {
    make(cliParse(process.argv.slice(2)))
}

module.exports = make