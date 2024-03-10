import handlebars from 'handlebars';
import fs from 'fs';

interface IParseMailVariable {
  [key: string]: string | number;
}

interface IParseMailTemplate {
  file: string;
  variables: IParseMailVariable;
}

class HandlebarsMailTemplate {
  public async parse({ file, variables }: IParseMailTemplate): Promise<string> {
    const templateFileContent = await fs.promises.readFile(file, {
      encoding: 'utf-8',
    });

    const parseTemplate = handlebars.compile(templateFileContent);

    return parseTemplate(variables);
  }
}

export default HandlebarsMailTemplate;
