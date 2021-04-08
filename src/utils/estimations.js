export const estimateAc = (target, touchScore, value) => {
  // if it hit
  if (value > 0 || value === 0) {
    return {
      acMax: target.acMax
        ? Math.min(target.acMax, parseInt(touchScore))
        : parseInt(touchScore),
    };
  } else {
    return {
      acMin: Math.max(target.acMin || 0, parseInt(touchScore) + 1),
    };
  }
};

export const estimateHps = (target, hpState, damageReceived) => {
  console.log("target", target);
  console.log("hpState", hpState);
  console.log("damageReceived", damageReceived);
  let hpMax, hpMin;
  if (target.hpState === hpState) {
    if (hpState === "green") {
      hpMin = Math.max(
        3 * damageReceived + 1,
        target.hpMin ? target.hpMin : -Infinity
      );
    }
    if (hpState === "orange") {
      hpMin = Math.max(
        (3 / 2) * damageReceived + 1,
        target.hpMin ? target.hpMin : -Infinity
      );
    }
    if (hpState === "red") {
      hpMin = Math.max(
        1 * damageReceived + 1,
        target.hpMin ? target.hpMin : -Infinity
      );
    }
  } else {
    if (hpState === "orange") {
      hpMax = Math.min(
        3 * damageReceived,
        target.hpMax ? target.hpMax : Infinity
      );
    }

    if (hpState === "red") {
      hpMax = Math.min(
        (3 / 2) * damageReceived,
        target.hpMax ? target.hpMax : Infinity
      );
    }
    if (hpState === "dead") {
      hpMax = Math.min(damageReceived, target.hpMax ? target.hpMax : Infinity);
    }
  }

  return {
    hpMax,
    hpMin,
  };
};
