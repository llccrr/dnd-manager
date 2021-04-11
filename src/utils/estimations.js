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
  let targetHpMax = target.hpMax ? target.hpMax : Infinity;
  let targetHpMin= target.hpMin ? target.hpMin : -Infinity;

  if (target.hpState === hpState) {
    if (hpState === "green") {
      hpMin = Math.max(
        3 * damageReceived + 1, targetHpMin
      );
    }
    if (hpState === "orange") {
      hpMin = Math.max(
        (3 / 2) * damageReceived + 1, targetHpMin
      );
    }
    if (hpState === "red") {
      hpMin = Math.max(
        1 * damageReceived + 1, targetHpMin
      );
    }
  } else {
    if (hpState === "orange") {
      hpMax = Math.min(
        3 * damageReceived, targetHpMax
      );
    }

    if (hpState === "red") {
      hpMax = Math.min(
        (3 / 2) * damageReceived, targetHpMax
      );
    }

    if (hpState === "dead") {
      hpMax = Math.min(damageReceived, targetHpMax);
    }
  }

  return {
    hpMax,
    hpMin,
  };
};
