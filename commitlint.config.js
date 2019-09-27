module.exports = {
  extends: ["gitmoji"],
  parserPreset: {
      parserOpts: {
          headerPattern: /^(:\w*:)(?:\s)(?:\((.*?)\))?\s((?:.*(?=\())|.*)(?:\(#(\d*)\))?/,
          headerCorrespondence: ["type", "scope", "subject", "ticket"]
      }
  }
};