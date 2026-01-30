module {
  public func run(old : { codePool : [Nat] }) : { codePool : [Nat] } {
    // Non structural update (migration due to data absence)
    // Only supports legacy canisters with no codePool in state
    old;
  };
};
