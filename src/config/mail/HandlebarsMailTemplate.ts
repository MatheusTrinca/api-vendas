import handlebars from 'handlebars';

interface IParseMailVariable {
  [key: string]: string | number;
}

interface IParseMailTemplate {
  template: string;
  variables: IParseMailVariable;
}

class HandlebarsMailTemplate {
  public async parse({
    template,
    variables,
  }: IParseMailTemplate): Promise<string> {
    const templateFileContent = handlebars.compile(template);

    return templateFileContent(variables);
  }
}

export default HandlebarsMailTemplate;
