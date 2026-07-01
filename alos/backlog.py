class Backlog:
    def __init__(self):
        self.items = []

    def add(self, item):
        self.items.append(item)

    def take(self):
        if not self.items:
            return None
        return self.items.pop(0)

    def count(self):
        return len(self.items)
