import { Table, TableBody, TableCell, TableRow, } from "../../../components/ui/table"

interface arrayTopData {
    Image?: string,
    ItemTitle: string,
    ItemBrand?: string,
    NumUsos?: number,
    NumVentas?: number
}

interface itemsProps {
    topData: arrayTopData[]
}



export default function TopItems({ topData }: itemsProps) {

    return (
        <div className="max-h-[220px] overflow-y-auto border rounded-md w-1/2 mx-2 my-8">
          <Table className="">
              <TableBody>
                  {topData.map((item) => (
                      <TableRow key={item.ItemTitle}>
                        
                            {item.Image && (
                                <TableCell>
                                    <img src={item.Image} className="h-16 w-16 border-1 rounded-md"></img>
                                </TableCell>
                              )}    
                          <TableCell>
                              {item.ItemTitle}
                              <p>{item.ItemBrand}</p>
                          </TableCell>
                          <TableCell>
                              {item.NumUsos}
                              {item.NumVentas}
                          </TableCell>
                      </TableRow>
                  ))}
              </TableBody>
          </Table>
        </div>
    )
}
