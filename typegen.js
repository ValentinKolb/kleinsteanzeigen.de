import inquirer from 'inquirer';
import {execSync} from "child_process";

inquirer
    .prompt([
        {
            type: 'text',
            name: 'email',
            message: 'Enter your email:',
            default: 'mail@valentin-kolb.com'
        },
        {
            type: 'password',
            name: 'password',
            message: 'Enter your password:',
        }
    ])
    .then(answers => {
        const result = execSync(`npx pocketbase-typegen --url https://myproject.pockethost.io --email ${answers.email} --password ${answers.password} --out ./lib/pocketbase-types.ts`).toString();
    });