import { File } from "./File";

export class ObjFile implements File {

    protected data: Object[] = [];
    protected length: number = 0;
    protected isOpenStatus: boolean = false;

    public isEmpty(): boolean {
      return this.length == 0;
    }

    public isOpen(): boolean {
      return this.isOpenStatus;
    }
  
    public isClosed(): boolean {
      return !this.open;
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
      this.length = this.data.length;
}
  
    public close(): void {
      this.assertIsOpenFile();
      this.isOpenStatus = false;
    }

    public delete(): void {
      this.assertIsClosedFile();
      this.data = [];
      this.length = 0;
    }

    protected assertIsOpenFile(): void {
      if (!this.isOpen()) {
        throw new Error("File must be open for this operation");
      }
    }

    protected assertIsClosedFile(): void {
      if (!this.isClosed()) {
            throw new Error("File must be closed for this operation");
          }
    }

}