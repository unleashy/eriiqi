export function renderMarkup(markup: string): string {
  return render(tokenise(markup));
}

type Token =
  | { is: "text"; text: string }
  | { is: "tag open"; tag: string }
  | { is: "tag close" };

function render(tokens: Iterable<Token>): string {
  let openTagStack: string[] = [];

  let textStack = [""];
  let write = (text: string) => (textStack[textStack.length - 1] += text);

  let closeTopTag = () => {
    let tag = openTagStack.pop();
    let text = textStack.pop();
    if (tag === "") {
      write(`<a href="/w/${text}">${text}</a>`);
    } else {
      write(`${text}</${tag}>`);
    }
  };

  for (let token of tokens) {
    switch (token.is) {
      case "text": {
        write(token.text);
        break;
      }

      case "tag open": {
        openTagStack.push(token.tag);
        textStack.push("");
        if (token.tag !== "") {
          write(`<${token.tag}>`);
        }
        break;
      }

      case "tag close": {
        closeTopTag();
        break;
      }
    }
  }

  while (openTagStack.length > 0) closeTopTag();

  return textStack.join("");
}

function* tokenise(markup: string): Generator<Token> {
  let lastToken = 0;
  for (let match of markup.matchAll(/[◇}]/gu)) {
    yield { is: "text", text: markup.slice(lastToken, match.index) };
    lastToken = match.index + 1;

    if (match[0] === "◇") {
      let open = markup.indexOf("{", match.index);
      if (open === -1) {
        yield { is: "text", text: "◇" };
        continue;
      }

      let tag = markup.slice(lastToken, open);
      lastToken = open + 1;

      yield { is: "tag open", tag };
    } else {
      yield { is: "tag close" };
    }
  }

  if (lastToken < markup.length) {
    yield { is: "text", text: markup.slice(lastToken) };
  }
}
