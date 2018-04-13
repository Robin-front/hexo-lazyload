class QueueMapLimit {
  constructor(concurrency) {
    this.running = 0;
    this.concurrency = concurrency;
  }
  add(arr, fn) {
    const self = this;
    const length = arr.length;
    return new Promise((resolve, reject) => {
      var completed = 0;
      var started = 0;
      var results = new Array(length);

      (function replenish() {
        if (completed >= length) {
          return resolve(results);
        }

        while (self.running < self.concurrency && started < length) {
          self.running++;
          started++;

          (function(index) {
            var cur = arr[index];
            fn
              .call(cur, cur, index, arr)
              .then(function(result) {
                self.running--;
                completed++;
                results[index] = result;

                replenish();
              })
              .catch(err => {
                self.running--;
                completed++;
                results[index] = undefined;

                replenish();
              });
          })(started - 1);
        }
        if (self.running >= self.concurrency){
          setTimeout(replenish, 0);
        }
      })();
    });
  }
}
module.exports = QueueMapLimit;