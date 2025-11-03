export class File {
    protected data: Object[] = [];
    protected isOpenStatus: boolean = false;
    
    public isOpen(): boolean {
      return this.isOpenStatus;
    }
  
    public isClosed(): boolean {
        return !this.isOpenStatus;
    }
  
    public open(): void {
      this.assertIsClosedFile();
      this.isOpenStatus = true;
    }

    public read(): Object[] {
      this.assertIsOpenFile();
      return [...this.data];
    }

    public write(data: Object[]): void {
      this.assertIsOpenFile();
      this.data = [...data];
    }
  
    public close(): void {
      this.assertIsOpenFile();
      this.isOpenStatus = false;
    }

    public delete(): void {
      this.assertIsClosedFile();
      this.data = [];
    }

    protected assertIsOpenFile(): void {
      if (!this.isOpen()) {
        throw new Error("File must be opened for this operation");
      }    }

    protected assertIsClosedFile(): void {
      if (!this.isClosed()) {
        throw new Error("File must be closed for this operation");
      }
    }

}